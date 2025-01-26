import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, GraduationCap } from "lucide-react";
import type { Candidate } from "@/types/index";
import { formatDate, calculateTenure } from "../../utils/dateFormatters";

interface CandidateProfileProps {
  candidate: Candidate;
}

export const CandidateProfile: React.FC<CandidateProfileProps> = ({
  candidate,
}) => {
  if (!candidate.profile) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-purple-900">Profile</h3>
      <div className="space-y-8">
        {/* Experience */}
        {candidate.profile.experiences &&
          candidate.profile.experiences.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-base font-medium text-purple-800/90 flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4" />
                Experience
              </h4>
              <div className="space-y-4">
                {candidate.profile.experiences.map((exp, index) => (
                  <Card key={index} className="border-purple-100/50">
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-purple-900">
                            {exp.title}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs text-purple-600 border-purple-200"
                          >
                            {calculateTenure(exp.starts_at, exp.ends_at)}
                          </Badge>
                        </div>
                        <p className="text-sm text-purple-700/90">
                          {exp.company}
                        </p>
                        <p className="text-xs text-purple-600/75">
                          {formatDate(exp.starts_at)} -{" "}
                          {exp.ends_at ? formatDate(exp.ends_at) : "Present"}
                        </p>
                      </div>
                      {exp.description && (
                        <div className="space-y-3 pt-2 border-t border-purple-100/50">
                          <p className="text-sm text-muted-foreground">
                            {exp.description}
                          </p>
                          {exp.ai_description && (
                            <div className="mt-3 p-3 bg-purple-50/50 rounded-md border border-purple-100/50">
                              <p className="text-sm font-medium text-purple-900 mb-2">
                                AI Analysis
                              </p>
                              <p className="text-sm text-purple-700">
                                {exp.ai_description}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

        {/* Education */}
        {candidate.profile.education &&
          candidate.profile.education.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-base font-medium text-purple-800/90 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </h4>
              <div className="space-y-4">
                {candidate.profile.education.map((edu, index) => (
                  <Card key={index} className="border-purple-100/50">
                    <div className="p-4 space-y-2">
                      <p className="font-medium text-purple-900">
                        {edu.school}
                      </p>
                      <p className="text-sm text-purple-700/90">
                        {edu.degree_name} in {edu.field_of_study}
                      </p>
                      {edu.starts_at && edu.ends_at && (
                        <p className="text-xs text-purple-600/75">
                          {formatDate(edu.starts_at)} -{" "}
                          {formatDate(edu.ends_at)}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
