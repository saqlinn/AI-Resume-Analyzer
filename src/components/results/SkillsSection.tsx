import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Users, Wrench, Award, CheckCircle, AlertCircle, Star, Zap, AlertTriangle, XCircle } from "lucide-react";

interface SkillsSectionProps {
  technicalSkills: string[];
  softSkills: string[];
  toolsTechnologies: string[];
  certifications: string[];
  strongSkills: string[];
  missingSkills: string[];
  topKeywords?: string[];
  requiredSkillsForRole?: string[];
}

export const SkillsSection = ({
  technicalSkills,
  softSkills,
  toolsTechnologies,
  certifications,
  strongSkills,
  missingSkills,
  topKeywords = [],
  requiredSkillsForRole = [],
}: SkillsSectionProps) => {
  const hasDetectedSkills = technicalSkills.length > 0 || strongSkills.length > 0;

  return (
    <div className="space-y-6">
      {/* Skills Detected in Your Resume */}
      <Card className="glass-card card-3d p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Skills Detected in Your Resume
        </h3>
        
        {hasDetectedSkills ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Matched Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {(topKeywords.length > 0 ? topKeywords : strongSkills).map((skill, idx) => (
                  <Badge key={idx} variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {technicalSkills.length > 0 && technicalSkills.some(s => !topKeywords.includes(s)) && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">All Detected Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {technicalSkills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-yellow-500/50" />
            <p className="font-medium">Limited skills detected from your resume</p>
            <p className="text-sm mt-1">Make sure your resume has a clear Skills section with relevant keywords</p>
          </div>
        )}
      </Card>

      {/* Skills Required for Target Role */}
      {requiredSkillsForRole.length > 0 && (
        <Card className="glass-card card-3d p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Skills Required for Target Role
          </h3>
          <div className="flex flex-wrap gap-2">
            {requiredSkillsForRole.map((skill, idx) => {
              const hasSkill = strongSkills.includes(skill) || technicalSkills.includes(skill);
              return (
                <Badge 
                  key={idx} 
                  variant={hasSkill ? "default" : "outline"}
                  className={hasSkill 
                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                    : "text-muted-foreground border-muted-foreground/30"
                  }
                >
                  {hasSkill ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {skill}
                </Badge>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            You have {strongSkills.filter(s => requiredSkillsForRole.includes(s)).length} of {requiredSkillsForRole.length} required skills
          </p>
        </Card>
      )}

      {/* Strong Skills & Missing Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card card-3d p-6 border-l-4 border-l-green-500">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Your Strong Skills
          </h3>
          {strongSkills.length > 0 ? (
            <ul className="space-y-2">
              {strongSkills.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{skill}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No strong skills identified</p>
          )}
        </Card>

        <Card className="glass-card card-3d p-6 border-l-4 border-l-destructive">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Skills to Add/Improve
          </h3>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-destructive border-destructive/30">
                  + {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No missing skills identified</p>
          )}
        </Card>
      </div>

      {/* Additional Categories (if data available) */}
      {(softSkills.length > 0 || toolsTechnologies.length > 0 || certifications.length > 0) && (
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Additional Skills Categories
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {softSkills.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-secondary">
                  <Users className="h-4 w-4" />
                  <h4 className="font-medium">Soft Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {softSkills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {toolsTechnologies.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <Wrench className="h-4 w-4" />
                  <h4 className="font-medium">Tools & Technologies</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {toolsTechnologies.map((tool, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {certifications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Award className="h-4 w-4" />
                  <h4 className="font-medium">Certifications</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, idx) => (
                    <Badge key={idx} variant="default" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
