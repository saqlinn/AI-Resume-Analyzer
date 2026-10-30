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
import { normalizeAnalysis, NormalizedAnalysis } from "@/utils/analysis";

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<NormalizedAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;

      // Try to get demo data from session storage first
      const demoData = sessionStorage.getItem(`demo-result-${id}`);
      if (demoData) {
        try {
          const parsedData = JSON.parse(demoData);
          const normalized = normalizeAnalysis(parsedData, id);
          if (!normalized) throw new Error("The saved analysis data is invalid.");
          setAnalysis(normalized);
          setLoading(false);
          return;
        } catch (e) {
          setError(e instanceof Error ? e.message : "The saved analysis data is invalid.");
          setLoading(false);
          return;
        }
      }
      setError("No valid analysis data was found for this result.");
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

  if (!analysis) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-2xl mx-auto text-center glass-card p-8">
            <h1 className="text-2xl font-bold mb-3">Unable to display this analysis</h1>
            <p className="text-muted-foreground mb-6">{error || "The analysis response was empty or invalid."}</p>
            <Button onClick={() => navigate("/upload")}>Upload another resume</Button>
          </div>
        </div>
      </div>
    );
  }

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
              classificationConfidence={analysis.classification_confidence_pct}
              secondaryRoles={analysis.secondary_roles}
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
              strongSkillEvidence={analysis.strong_skill_evidence}
              missingSkills={analysis.missing_skills}
              topKeywords={analysis.top_keywords}
              requiredSkillsForRole={analysis.required_skills_for_role}
            />
          </div>

          {/* Improvement Suggestions */}
          <div className="mb-8">
            <ImprovementSuggestions
              improvementAreas={analysis.improvement_areas}
              recommendations={analysis.recommendations}
              atsScore={analysis.ats_score || 0}
              missingSkills={analysis.missing_skills}
              whyMissing={analysis.why_missing}
              issues={analysis.issues}
              warnings={analysis.warnings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
