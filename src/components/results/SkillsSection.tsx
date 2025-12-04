import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Users, Wrench, Award, CheckCircle, AlertCircle } from "lucide-react";

interface SkillsSectionProps {
  technicalSkills: string[];
  softSkills: string[];
  toolsTechnologies: string[];
  certifications: string[];
  strongSkills: string[];
  missingSkills: string[];
}

export const SkillsSection = ({
  technicalSkills,
  softSkills,
  toolsTechnologies,
  certifications,
  strongSkills,
  missingSkills,
}: SkillsSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Skills You Have */}
      <Card className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Skills You Have
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Technical Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Code className="h-4 w-4" />
              <h4 className="font-medium">Technical Skills</h4>
            </div>
            {technicalSkills.length > 0 ? (
              <div className="space-y-1">
                {technicalSkills.map((skill, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">None detected</p>
            )}
          </div>

          {/* Soft Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Users className="h-4 w-4" />
              <h4 className="font-medium">Soft Skills</h4>
            </div>
            {softSkills.length > 0 ? (
              <div className="space-y-1">
                {softSkills.map((skill, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">None detected</p>
            )}
          </div>

          {/* Tools & Technologies */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Wrench className="h-4 w-4" />
              <h4 className="font-medium">Tools & Technologies</h4>
            </div>
            {toolsTechnologies.length > 0 ? (
              <div className="space-y-1">
                {toolsTechnologies.map((tool, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">None detected</p>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-yellow-500">
              <Award className="h-4 w-4" />
              <h4 className="font-medium">Certifications</h4>
            </div>
            {certifications.length > 0 ? (
              <div className="space-y-1">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">None detected</p>
            )}
          </div>
        </div>
      </Card>

      {/* Strong Skills & Missing Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card card-3d p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Your Strong Skills
          </h3>
          {strongSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {strongSkills.map((skill, idx) => (
                <Badge key={idx} className="bg-green-500/20 text-green-400 border-green-500/30">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No strong skills identified</p>
          )}
        </Card>

        <Card className="glass-card card-3d p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Skills to Add/Improve
          </h3>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="bg-red-500/10 border-red-500/30 text-red-400">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No missing skills identified</p>
          )}
        </Card>
      </div>
    </div>
  );
};
