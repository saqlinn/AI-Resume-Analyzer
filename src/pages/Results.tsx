import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

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
    rawResponse?: any;
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

      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('resume_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching analysis:", error);
        toast.error("Failed to load analysis");
        navigate("/dashboard");
        return;
      }

      if (!data) {
        toast.error("Analysis not found");
        navigate("/dashboard");
        return;
      }

      // Cast analysis_data from Json to our expected type
      setAnalysis({
        ...data,
        analysis_data: data.analysis_data as { recommendations?: string[]; rawResponse?: any } | undefined
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
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
            </div>
          </div>

          {/* Scores Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card card-3d p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">ATS Score</h3>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl font-bold ${getScoreColor(analysis.ats_score)}`}>
                  {analysis.ats_score}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <Progress value={analysis.ats_score} className="h-2" />
            </Card>

            <Card className="glass-card card-3d p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Keyword Match</h3>
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl font-bold ${getScoreColor(analysis.keyword_score)}`}>
                  {analysis.keyword_score}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <Progress value={analysis.keyword_score} className="h-2" />
            </Card>

            <Card className="glass-card card-3d p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Role Relevancy</h3>
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl font-bold ${getScoreColor(analysis.role_relevancy_score)}`}>
                  {analysis.role_relevancy_score}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <Progress value={analysis.role_relevancy_score} className="h-2" />
            </Card>
          </div>

          {/* Category */}
          <Card className="glass-card p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Resume Category</h3>
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-primary to-secondary">
              {analysis.category}
            </Badge>
          </Card>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="glass-card card-3d p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Strong Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.strong_skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="bg-green-500/10 border-green-500/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="glass-card card-3d p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="bg-red-500/10 border-red-500/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Detailed Skills */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
              <div className="space-y-2">
                {analysis.technical_skills.map((skill, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground">
                    • {skill}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Soft Skills</h3>
              <div className="space-y-2">
                {analysis.soft_skills.map((skill, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground">
                    • {skill}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Tools & Technologies</h3>
              <div className="space-y-2">
                {analysis.tools_technologies.map((tool, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground">
                    • {tool}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Improvement Areas */}
          {analysis.improvement_areas.length > 0 && (
            <Card className="glass-card card-3d p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Areas for Improvement</h3>
              <div className="space-y-3">
                {analysis.improvement_areas.map((area, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-muted-foreground">{area}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Certifications */}
          {analysis.certifications.length > 0 && (
            <Card className="glass-card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                    {cert}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.analysis_data?.recommendations && analysis.analysis_data.recommendations.length > 0 && (
            <Card className="glass-card card-3d p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {analysis.analysis_data.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{idx + 1}</span>
                    </div>
                    <p className="text-muted-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
