import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ScoreCardsProps {
  atsScore: number;
  keywordScore: number;
  roleRelevancyScore: number;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const getScoreIcon = (score: number) => {
  if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  return <XCircle className="h-5 w-5 text-red-500" />;
};

const getATSFriendlyStatus = (score: number) => {
  if (score >= 80) return { status: "ATS Friendly", description: "Your resume is well-optimized for ATS systems", color: "text-green-500" };
  if (score >= 60) return { status: "Needs Improvement", description: "Your resume may pass some ATS systems but needs optimization", color: "text-yellow-500" };
  return { status: "Not ATS Friendly", description: "Your resume likely won't pass ATS filters - major improvements needed", color: "text-red-500" };
};

export const ScoreCards = ({ atsScore, keywordScore, roleRelevancyScore }: ScoreCardsProps) => {
  const atsStatus = getATSFriendlyStatus(atsScore);

  return (
    <div className="space-y-6">
      {/* ATS Friendliness Banner */}
      <Card className="glass-card p-6 border-l-4 border-l-primary">
        <div className="flex items-start gap-4">
          {getScoreIcon(atsScore)}
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${atsStatus.color}`}>{atsStatus.status}</h3>
            <p className="text-muted-foreground text-sm mt-1">{atsStatus.description}</p>
          </div>
          <div className="text-right">
            <span className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>{atsScore}</span>
            <span className="text-muted-foreground text-sm">/100</span>
          </div>
        </div>
      </Card>

      {/* Score Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card card-3d p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">ATS Score</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>
              {atsScore}
            </span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <Progress value={atsScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {atsScore >= 80 ? "Excellent format & structure" : atsScore >= 60 ? "Good but can improve" : "Needs significant work"}
          </p>
        </Card>

        <Card className="glass-card card-3d p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Keyword Match</h3>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-4xl font-bold ${getScoreColor(keywordScore)}`}>
              {keywordScore}
            </span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <Progress value={keywordScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {keywordScore >= 80 ? "Strong keyword presence" : keywordScore >= 60 ? "Add more relevant keywords" : "Missing critical keywords"}
          </p>
        </Card>

        <Card className="glass-card card-3d p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Role Relevancy</h3>
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-4xl font-bold ${getScoreColor(roleRelevancyScore)}`}>
              {roleRelevancyScore}
            </span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <Progress value={roleRelevancyScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {roleRelevancyScore >= 80 ? "Highly relevant experience" : roleRelevancyScore >= 60 ? "Partially relevant" : "Low role alignment"}
          </p>
        </Card>
      </div>
    </div>
  );
};
