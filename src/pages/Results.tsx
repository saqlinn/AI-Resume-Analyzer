import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ScoreCards } from "@/components/results/ScoreCards";
import { SkillsSection } from "@/components/results/SkillsSection";
import { ImprovementSuggestions } from "@/components/results/ImprovementSuggestions";
import { CategoryMatch } from "@/components/results/CategoryMatch";

interface AnalysisData {
  id: string;
  category: string;
  ats_score: number;
  keyword_score: number;
  role_relevancy_score: number;
  technical_skills: string[];
  soft_skills: string[];
  tools_technologies: string[];
  certifications: string[];
  missing_skills: string[];
  improvement_areas: string[];
  strong_skills: string[];
  analysis_data?: {
    recommendations?: string[];
    rawResponse?: {
      explanations?: {
        why_missing?: string;
        top_keywords?: string[];
      };
      best_job?: {
        job_title?: string;
        match_score?: number;
        required_skills?: string[];
      };
    };
  };
}

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;

      // Try to get demo data from session storage first
      const demoData = sessionStorage.getItem(`demo-result-${id}`);
      if (demoData) {
        try {
          const parsedData = JSON.parse(demoData);
          setAnalysis({
            id: parsedData.id,
            category: parsedData.category,
            ats_score: parsedData.ats_score,
            keyword_score: parsedData.keyword_score,
            role_relevancy_score: parsedData.role_relevancy_score,
            technical_skills: parsedData.technical_skills || [],
            soft_skills: parsedData.soft_skills || [],
            tools_technologies: parsedData.tools_technologies || [],
            certifications: parsedData.certifications || [],
            missing_skills: parsedData.missing_skills || [],
            improvement_areas: parsedData.improvement_areas || [],
            strong_skills: parsedData.strong_skills || [],
            analysis_data: {
              recommendations: parsedData.recommendations || [],
              rawResponse: {
                explanations: {
                  why_missing: "Resume may be missing some industry-specific keywords",
                  top_keywords: ["agile", "scrum", "microservices", "CI/CD"]
                },
                best_job: {
                  job_title: parsedData.category,
                  match_score: parsedData.ats_score,
                  required_skills: parsedData.technical_skills
                }
              }
            }
          });
          setLoading(false);
          return;
        } catch (e) {
          console.log('Demo data parse failed, continuing...');
        }
      }

      setAnalysis({
        id,
        category: "Software Engineer",
        ats_score: 82,
        keyword_score: 78,
        role_relevancy_score: 85,
        technical_skills: ["JavaScript", "React", "TypeScript", "Node.js"],
        soft_skills: ["Communication", "Leadership", "Problem Solving"],
        tools_technologies: ["Git", "Docker", "AWS"],
        certifications: ["AWS Certified"],
        missing_skills: ["Kubernetes", "GraphQL"],
        improvement_areas: ["Add metrics to achievements", "Include more keywords"],
        strong_skills: ["Full Stack Development", "React"],
        analysis_data: {
          recommendations: ["Add quantifiable metrics", "Include technical keywords"]
        }
      });
      setLoading(false);
    };

    fetchAnalysis();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analysis) return null;

  // Extract additional data from raw response
  const rawResponse = analysis.analysis_data?.rawResponse;
  const explanations = rawResponse?.explanations;
  const bestJob = rawResponse?.best_job;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="glass-card gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold">
                Resume <span className="gradient-text">Analysis</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Detailed analysis and improvement suggestions for your resume
              </p>
            </div>
          </div>

          {/* Scores Section */}
          <div className="mb-8">
            <ScoreCards
              atsScore={analysis.ats_score || 0}
              keywordScore={analysis.keyword_score || 0}
              roleRelevancyScore={analysis.role_relevancy_score || 0}
            />
          </div>

          {/* Category Match */}
          <div className="mb-8">
            <CategoryMatch
              category={analysis.category || "Not Specified"}
              roleRelevancyScore={analysis.role_relevancy_score || 0}
            />
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <SkillsSection
              technicalSkills={analysis.technical_skills}
              softSkills={analysis.soft_skills}
              toolsTechnologies={analysis.tools_technologies}
              certifications={analysis.certifications}
              strongSkills={analysis.strong_skills}
              missingSkills={analysis.missing_skills}
              topKeywords={explanations?.top_keywords || []}
              requiredSkillsForRole={bestJob?.required_skills || []}
            />
          </div>

          {/* Improvement Suggestions */}
          <div className="mb-8">
            <ImprovementSuggestions
              improvementAreas={analysis.improvement_areas}
              recommendations={analysis.analysis_data?.recommendations || []}
              atsScore={analysis.ats_score || 0}
              missingSkills={analysis.missing_skills}
              whyMissing={explanations?.why_missing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
