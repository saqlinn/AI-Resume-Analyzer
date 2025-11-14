import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, fileName } = await req.json();
    console.log('Analyzing resume:', fileName);

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error("Resume text is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt for resume analysis
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the provided resume and extract structured information.

Your analysis should include:
1. Resume Category/Role (e.g., Software Developer, Data Scientist, UI/UX Designer, Digital Marketer, etc.)
2. Technical Skills (programming languages, frameworks, tools)
3. Soft Skills (communication, leadership, problem-solving, etc.)
4. Tools & Technologies
5. Certifications
6. Experience Keywords
7. Missing Skills (compare with standard requirements for the identified role)
8. Skills that need improvement
9. Strong skills that match industry standards
10. ATS Score (0-100) based on keyword density, formatting, and completeness
11. Keyword Match Score (0-100)
12. Role Relevancy Score (0-100)

Provide actionable recommendations for improvement.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this resume:\n\n${resumeText}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_resume",
            description: "Extract structured resume analysis data",
            parameters: {
              type: "object",
              properties: {
                category: { type: "string", description: "Primary job role/category" },
                ats_score: { type: "integer", minimum: 0, maximum: 100 },
                keyword_score: { type: "integer", minimum: 0, maximum: 100 },
                role_relevancy_score: { type: "integer", minimum: 0, maximum: 100 },
                technical_skills: { type: "array", items: { type: "string" } },
                soft_skills: { type: "array", items: { type: "string" } },
                tools_technologies: { type: "array", items: { type: "string" } },
                certifications: { type: "array", items: { type: "string" } },
                missing_skills: { type: "array", items: { type: "string" } },
                improvement_areas: { type: "array", items: { type: "string" } },
                strong_skills: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } }
              },
              required: ["category", "ats_score", "keyword_score", "role_relevancy_score"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_resume" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI Response received");

    // Extract the tool call result
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No analysis data received from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis: {
          category: analysis.category || "Not specified",
          ats_score: analysis.ats_score || 0,
          keyword_score: analysis.keyword_score || 0,
          role_relevancy_score: analysis.role_relevancy_score || 0,
          technical_skills: analysis.technical_skills || [],
          soft_skills: analysis.soft_skills || [],
          tools_technologies: analysis.tools_technologies || [],
          certifications: analysis.certifications || [],
          missing_skills: analysis.missing_skills || [],
          improvement_areas: analysis.improvement_areas || [],
          strong_skills: analysis.strong_skills || [],
          recommendations: analysis.recommendations || []
        }
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
