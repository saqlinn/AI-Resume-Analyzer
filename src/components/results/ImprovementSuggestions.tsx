import { Card } from "@/components/ui/card";
import { Lightbulb, FileText, Briefcase, Layout, Target, ListChecks, AlertCircle } from "lucide-react";

interface ImprovementSuggestionsProps {
  improvementAreas: string[];
  recommendations: string[];
  atsScore: number;
  missingSkills: string[];
  whyMissing?: string;
}

export const ImprovementSuggestions = ({
  improvementAreas,
  recommendations,
  atsScore,
  missingSkills,
  whyMissing,
}: ImprovementSuggestionsProps) => {
  // Get ATS status message
  const getAtsStatus = () => {
    if (atsScore >= 80) return { text: "Excellent", color: "text-green-500", bg: "bg-green-500/20" };
    if (atsScore >= 60) return { text: "Good", color: "text-yellow-500", bg: "bg-yellow-500/20" };
    if (atsScore >= 40) return { text: "Needs Work", color: "text-orange-500", bg: "bg-orange-500/20" };
    return { text: "Poor", color: "text-red-500", bg: "bg-red-500/20" };
  };

  const atsStatus = getAtsStatus();

  return (
    <div className="space-y-6">
      {/* Analysis Summary Card */}
      <Card className="glass-card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Analysis Summary
        </h3>
        
        <div className="space-y-4">
          {/* ATS Status */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">ATS Compatibility:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${atsStatus.bg} ${atsStatus.color}`}>
              {atsStatus.text} ({atsScore}%)
            </span>
          </div>
          
          {/* Main Explanation */}
          {whyMissing && (
            <div className="p-4 rounded-lg bg-muted/30 border border-muted">
              <p className="text-sm text-muted-foreground">{whyMissing}</p>
            </div>
          )}
          
          {/* Quick Summary */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              {atsScore >= 70 
                ? "Your resume is well-optimized for ATS systems. Focus on tailoring it for specific job applications to maximize your chances."
                : atsScore >= 40
                ? "Your resume has room for improvement. Adding relevant keywords and skills will help you pass ATS filters more effectively."
                : "Your resume needs significant improvements to pass ATS screening. Follow the suggestions below to increase your visibility to recruiters."
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Specific Improvement Areas from Backend */}
      {improvementAreas.length > 0 && (
        <Card className="glass-card card-3d p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            What to Improve
          </h3>
          <div className="space-y-3">
            {improvementAreas.map((area, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{idx + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground">{area}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Missing Keywords to Add */}
      {missingSkills.length > 0 && (
        <Card className="glass-card card-3d p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Keywords to Add
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add these keywords to your resume to improve your match score:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {missingSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="text-sm font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <Card className="glass-card card-3d p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-secondary" />
            Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-secondary">{idx + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* How to Improve Your Resume */}
      <Card className="glass-card p-6 border-l-4 border-l-accent">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          How to Improve Your Resume
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-500 mb-3">✓ Do This</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Add a dedicated Skills section with relevant keywords</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Use exact skill names from job descriptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Include quantifiable achievements with numbers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Use standard section headings (Experience, Education, Skills)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Keep formatting simple and ATS-friendly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>List certifications and tools you've used</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-500 mb-3">✗ Avoid This</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Graphics, images, or logos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Tables or multi-column layouts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Headers/footers with important info</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Fancy fonts or unusual formatting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Abbreviations without full terms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Generic skills without context</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
