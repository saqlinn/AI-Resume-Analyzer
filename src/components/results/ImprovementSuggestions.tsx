import { Card } from "@/components/ui/card";
import { Lightbulb, FileText, Briefcase, Layout, Target, ListChecks } from "lucide-react";

interface ImprovementSuggestionsProps {
  improvementAreas: string[];
  recommendations: string[];
  atsScore: number;
  missingSkills: string[];
}

export const ImprovementSuggestions = ({
  improvementAreas,
  recommendations,
  atsScore,
  missingSkills,
}: ImprovementSuggestionsProps) => {
  // Generate actionable suggestions based on score and data
  const getFormatSuggestions = () => {
    const suggestions = [];
    if (atsScore < 80) {
      suggestions.push({
        icon: <Layout className="h-5 w-5" />,
        title: "Improve Resume Format",
        items: [
          "Use a clean, single-column layout",
          "Avoid tables, graphics, or images",
          "Use standard fonts (Arial, Calibri, Times New Roman)",
          "Save as .docx or .pdf format",
          "Use clear section headings (Experience, Education, Skills)"
        ]
      });
    }
    return suggestions;
  };

  const getContentSuggestions = () => {
    const suggestions = [];
    suggestions.push({
      icon: <Briefcase className="h-5 w-5" />,
      title: "Add Missing Experience Details",
      items: [
        "Include job titles with company names and dates",
        "Add quantifiable achievements (numbers, percentages)",
        "Use action verbs to start bullet points",
        "Include relevant projects and their outcomes",
        "Add internships or volunteer work if lacking experience"
      ]
    });
    return suggestions;
  };

  const getKeywordSuggestions = () => {
    if (missingSkills.length === 0) return [];
    return [{
      icon: <Target className="h-5 w-5" />,
      title: "Add These Keywords",
      items: missingSkills.slice(0, 8).map(skill => `Add "${skill}" to your skills or experience section`)
    }];
  };

  const allSuggestions = [
    ...getFormatSuggestions(),
    ...getContentSuggestions(),
    ...getKeywordSuggestions()
  ];

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="glass-card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Improvement Summary
        </h3>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground">
            {atsScore >= 80 
              ? "Your resume is well-structured for ATS systems. Focus on tailoring keywords for specific job applications."
              : atsScore >= 60
              ? "Your resume needs some improvements to pass ATS filters effectively. Focus on format and keyword optimization."
              : "Your resume requires significant improvements. Follow the suggestions below to make it ATS-friendly and increase your chances of getting interviews."
            }
          </p>
        </div>
      </Card>

      {/* Actionable Suggestions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSuggestions.map((suggestion, idx) => (
          <Card key={idx} className="glass-card card-3d p-6">
            <div className="flex items-center gap-2 mb-4 text-primary">
              {suggestion.icon}
              <h4 className="font-semibold">{suggestion.title}</h4>
            </div>
            <ul className="space-y-2">
              {suggestion.items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1 flex-shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Backend Improvement Areas */}
      {improvementAreas.length > 0 && (
        <Card className="glass-card card-3d p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Specific Areas to Improve
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
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

      {/* Recommendations from Backend */}
      {recommendations.length > 0 && (
        <Card className="glass-card card-3d p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-secondary" />
            Personalized Recommendations
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

      {/* How Your Resume Should Look */}
      <Card className="glass-card p-6 border-l-4 border-l-accent">
        <h3 className="text-xl font-semibold mb-4">How Your Resume Should Look</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-500 mb-2">✓ Do This</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use clear section headings</li>
              <li>• Include contact info at the top</li>
              <li>• List experience in reverse chronological order</li>
              <li>• Use bullet points for achievements</li>
              <li>• Keep it to 1-2 pages maximum</li>
              <li>• Include a professional summary</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-500 mb-2">✗ Avoid This</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Headers or footers with important info</li>
              <li>• Tables, columns, or text boxes</li>
              <li>• Images, logos, or graphics</li>
              <li>• Fancy fonts or colors</li>
              <li>• Abbreviations without full terms</li>
              <li>• Personal pronouns (I, me, my)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
