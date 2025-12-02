import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    // Call your backend API
    const backendResponse = await fetch(BACKEND_API_URL, {
      method: 'POST',
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("Backend API error:", backendResponse.status, errorText);
      throw new Error(`Backend API error: ${backendResponse.status} - ${errorText}`);
    }

    const backendData = await backendResponse.json();
    console.log("Backend response received:", JSON.stringify(backendData).substring(0, 200));

    // Map backend response to our expected format
    const presentSkills = backendData.skills?.present || [];
    const analysis = {
      category: backendData.category || "Not specified",
      ats_score: backendData.ats_score || 0,
      keyword_score: backendData.match_score || backendData.keyword_score || 0,
      role_relevancy_score: backendData.match_score || backendData.role_relevancy_score || 0,
      technical_skills: presentSkills,
      soft_skills: backendData.soft_skills || [],
      tools_technologies: backendData.tools_technologies || [],
      certifications: backendData.certifications || [],
      missing_skills: backendData.missing_skills || [],
      improvement_areas: backendData.improvement_areas || [],
      strong_skills: presentSkills,
      recommendations: backendData.recommendations || []
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis,
        rawResponse: backendData // Include raw response for debugging
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
