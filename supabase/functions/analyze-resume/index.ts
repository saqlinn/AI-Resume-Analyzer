import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BACKEND_API_URL = "https://backend-for-ats-model.onrender.com/v1/analyzeResume";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let fileBlob: Blob;
    let fileName: string;

    // Handle both JSON and FormData inputs
    if (contentType.includes('application/json')) {
      const { fileData, fileName: fn } = await req.json();
      fileName = fn;
      
      // Convert base64 to blob if needed
      if (fileData.startsWith('data:')) {
        const base64Data = fileData.split(',')[1];
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        fileBlob = new Blob([binaryData], { type: 'application/pdf' });
      } else {
        throw new Error("Invalid file data format");
      }
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      fileName = file.name;
      fileBlob = file;
    } else {
      throw new Error("Unsupported content type");
    }

    console.log('Forwarding resume to backend:', fileName);

    // Create FormData for the backend API
    const backendFormData = new FormData();
    backendFormData.append('file', fileBlob, fileName);

    // Call your backend API with extended timeout (5 minutes for slow backends)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);
    
    let backendResponse: Response;
    try {
      backendResponse = await fetch(BACKEND_API_URL, {
        method: 'POST',
        body: backendFormData,
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error("Backend timeout: Analysis took too long (>5 minutes)");
      }
      throw new Error(`Failed to connect to backend: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
    }
    clearTimeout(timeoutId);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("Backend API error:", backendResponse.status, errorText);
      throw new Error(`Backend API error: ${backendResponse.status} - ${errorText}`);
    }

    const backendData = await backendResponse.json();
    console.log("Full backend response:", JSON.stringify(backendData));

    // Extract all available data from backend response
    const presentSkills = backendData.skills?.present || [];
    const missingSkills = backendData.missing_skills || [];
    const bestJob = backendData.best_job || {};
    const explanations = backendData.explanations || {};
    
    // Build improvement areas from backend data
    const improvementAreas: string[] = [];
    
    // Add why_missing explanation if available
    if (explanations.why_missing) {
      improvementAreas.push(explanations.why_missing);
    }
    
    // Add specific skill recommendations
    if (missingSkills.length > 0) {
      improvementAreas.push(`Consider adding these key skills: ${missingSkills.slice(0, 5).join(', ')}`);
    }
    
    // Add job-specific recommendations
    if (bestJob.required_skills && bestJob.required_skills.length > 0) {
      const missingFromRole = bestJob.required_skills.filter((s: string) => !presentSkills.includes(s));
      
      if (missingFromRole.length > 0) {
        improvementAreas.push(`For ${bestJob.job_title} role, add: ${missingFromRole.join(', ')}`);
      }
    }
    
    // Build recommendations based on ATS score
    const recommendations: string[] = [];
    const atsScore = backendData.ats_score || 0;
    
    if (atsScore < 50) {
      recommendations.push("Your resume needs significant improvements to pass ATS systems");
      recommendations.push("Focus on adding more relevant keywords from job descriptions");
      recommendations.push("Ensure your skills section is comprehensive and matches your target role");
    } else if (atsScore < 70) {
      recommendations.push("Your resume is moderately optimized but could be improved");
      recommendations.push("Add more industry-specific keywords and technical terms");
    } else {
      recommendations.push("Your resume has good ATS compatibility");
      recommendations.push("Consider tailoring keywords for specific job applications");
    }
    
    if (presentSkills.length < 5) {
      recommendations.push("Add more skills to your resume - aim for at least 8-10 relevant skills");
    }
    
    // Map backend response to our expected format
    const analysis = {
      category: backendData.category || "Not specified",
      ats_score: atsScore,
      keyword_score: backendData.match_score || 0,
      role_relevancy_score: backendData.match_score || 0,
      technical_skills: presentSkills,
      soft_skills: [],
      tools_technologies: [],
      certifications: [],
      missing_skills: missingSkills,
      improvement_areas: improvementAreas,
      strong_skills: presentSkills,
      recommendations: recommendations,
      best_job: bestJob,
      explanations: explanations,
      top_keywords: explanations.top_keywords || presentSkills,
      required_skills_for_role: bestJob.required_skills || []
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis,
        rawResponse: backendData
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-resume function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
