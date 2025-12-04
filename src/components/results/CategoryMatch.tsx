import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase } from "lucide-react";

interface CategoryMatchProps {
  category: string;
  roleRelevancyScore: number;
}

export const CategoryMatch = ({ category, roleRelevancyScore }: CategoryMatchProps) => {
  // Parse category to show potential matches
  const getMatchPercentages = () => {
    // Primary match
    const primaryMatch = {
      role: category || "General",
      percentage: roleRelevancyScore || 0
    };
    
    // If score is less than 100, show potential other matches
    const otherMatches = [];
    if (roleRelevancyScore < 100 && roleRelevancyScore > 0) {
      const remaining = 100 - roleRelevancyScore;
      otherMatches.push({
        role: "Other Related Roles",
        percentage: remaining
      });
    }

    return { primaryMatch, otherMatches };
  };

  const { primaryMatch, otherMatches } = getMatchPercentages();

  return (
    <Card className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        Resume Category Match
      </h3>
      
      <div className="space-y-4">
        {/* Primary Category */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-primary to-secondary">
              {primaryMatch.role}
            </Badge>
            <span className="text-2xl font-bold text-primary">{primaryMatch.percentage}%</span>
          </div>
          <Progress value={primaryMatch.percentage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            Your resume is {primaryMatch.percentage}% aligned with {primaryMatch.role} positions
          </p>
        </div>

        {/* Other potential matches */}
        {otherMatches.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Other potential matches:</p>
            {otherMatches.map((match, idx) => (
              <div key={idx} className="flex items-center gap-4 p-2 rounded bg-muted/30">
                <span className="text-sm text-muted-foreground flex-1">{match.role}</span>
                <span className="text-sm font-medium">{match.percentage}%</span>
                <Progress value={match.percentage} className="w-24 h-2" />
              </div>
            ))}
          </div>
        )}

        {/* Interpretation */}
        <div className="p-3 rounded bg-muted/30 text-sm text-muted-foreground">
          {roleRelevancyScore >= 80 
            ? "✓ Your resume strongly aligns with this category. Keep tailoring for specific job descriptions."
            : roleRelevancyScore >= 60
            ? "⚠ Your resume partially matches. Consider adding more relevant experience and keywords."
            : "⚡ Consider pivoting your resume focus or gaining more relevant experience for this category."
          }
        </div>
      </div>
    </Card>
  );
};
