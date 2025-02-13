import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, GraduationCap, ExternalLink } from "lucide-react";
import type { Candidate, ProfileExperience } from "@/types/index";
import { formatDate, calculateTenure } from "../../utils/dateFormatters";
import { CareerMetrics } from "./CareerMetrics";

interface CandidateProfileProps {
  candidate: Candidate;
}

interface GroupedExperience {
  company: string;
  company_linkedin_profile_url?: string;
  roles: Array<ProfileExperience>;
  overall_start: string;
  overall_end?: string;
  funding_stages_during_tenure?: string[];
}

const groupExperiences = (
  experiences: ProfileExperience[]
): GroupedExperience[] => {
  const sortedExperiences = [...experiences].sort(
    (a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
  );

  const grouped: GroupedExperience[] = [];
  let currentGroup: GroupedExperience | null = null;

  sortedExperiences.forEach((exp) => {
    if (!currentGroup || currentGroup.company !== exp.company) {
      if (currentGroup) {
        grouped.push(currentGroup);
      }
      currentGroup = {
        company: exp.company,
        company_linkedin_profile_url: exp.company_linkedin_profile_url,
        roles: [exp],
        overall_start: exp.starts_at,
        overall_end: exp.ends_at,
        funding_stages_during_tenure: exp.funding_stages_during_tenure,
      };
    } else {
      currentGroup.roles.push(exp);
      // Update overall dates
      if (new Date(exp.starts_at) < new Date(currentGroup.overall_start)) {
        currentGroup.overall_start = exp.starts_at;
      }
      if (
        !currentGroup.overall_end ||
        (exp.ends_at &&
          new Date(exp.ends_at) > new Date(currentGroup.overall_end))
      ) {
        currentGroup.overall_end = exp.ends_at;
      }
      // Merge funding stages
      if (exp.funding_stages_during_tenure) {
        currentGroup.funding_stages_during_tenure = [
          ...new Set([
            ...(currentGroup.funding_stages_during_tenure || []),
            ...exp.funding_stages_during_tenure,
          ]),
        ];
      }
    }
  });

  if (currentGroup) {
    grouped.push(currentGroup);
  }

  return grouped;
};

export const CandidateProfile: React.FC<CandidateProfileProps> = ({
  candidate,
}) => {
  const formatFundingStages = (stages?: string[]) => {
    if (!stages) return null;

    // Filter out Unknown stages and get unique stages
    const validStages = [
      ...new Set(stages.filter((stage) => stage !== "Unknown")),
    ];

    if (validStages.length === 0) return null;

    // Skip if the only stage was IPO
    if (validStages.length === 1 && validStages[0] === "IPO") return null;

    if (validStages.length === 1) {
      return `Worked during ${validStages[0]}`;
    }

    const firstStage = validStages[0];
    const lastStage = validStages[validStages.length - 1];

    return firstStage === lastStage
      ? `Worked during ${firstStage}`
      : `Worked during ${firstStage} to ${lastStage}`;
  };

  if (!candidate.profile) return null;

  const groupedExperiences = groupExperiences(
    candidate.profile.experiences || []
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-purple-900">Profile</h3>
      <div className="space-y-8">
        {/* Career Metrics */}
        {candidate.profile.career_metrics && (
          <CareerMetrics metrics={candidate.profile.career_metrics} />
        )}

        {/* Experience */}
        {groupedExperiences.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium text-purple-800/90 flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4" />
              Experience
            </h4>
            <div className="space-y-4">
              {groupedExperiences.map((exp, index) => (
                <Card key={index} className="border-purple-100/50">
                  <div className="p-4 space-y-3">
                    {exp.roles.length === 1 ? (
                      // Single role experience
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-purple-900">
                            {exp.roles[0].title}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs text-purple-600 border-purple-200"
                          >
                            {calculateTenure(
                              exp.roles[0].starts_at,
                              exp.roles[0].ends_at || null
                            )}
                          </Badge>
                        </div>
                        {exp.company_linkedin_profile_url ? (
                          <a
                            href={exp.company_linkedin_profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-700/90 hover:text-purple-900 hover:underline inline-flex items-center gap-1"
                          >
                            {exp.company}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <p className="text-sm text-purple-700/90">
                            {exp.company}
                          </p>
                        )}
                        <p className="text-xs text-purple-600/75">
                          {formatDate(exp.roles[0].starts_at)} -{" "}
                          {exp.roles[0].ends_at
                            ? formatDate(exp.roles[0].ends_at)
                            : "Present"}
                        </p>
                        {exp.funding_stages_during_tenure &&
                          formatFundingStages(
                            exp.funding_stages_during_tenure
                          ) && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 mt-1"
                            >
                              {formatFundingStages(
                                exp.funding_stages_during_tenure
                              )}
                            </Badge>
                          )}
                        {exp.roles[0].description && (
                          <div className="space-y-3 pt-2 border-t border-purple-100/50">
                            <p className="text-sm text-muted-foreground">
                              {exp.roles[0].description}
                            </p>
                          </div>
                        )}
                        {exp.roles[0].summarized_job_description && (
                          <div className="mt-3 p-3 bg-purple-50 rounded-md">
                            <p className="text-sm text-gray-700 font-medium">
                              Generated Job Description
                            </p>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-xs">
                                  Role Summary:
                                </h4>
                                <p className="text-gray-600 text-xs">
                                  {
                                    exp.roles[0].summarized_job_description
                                      .role_summary
                                  }
                                </p>
                              </div>

                              {exp.roles[0].summarized_job_description
                                .skills && (
                                <div>
                                  <h4 className="font-medium text-xs">
                                    Skills:
                                  </h4>
                                  <ul className="list-disc list-inside text-gray-600 text-xs pl-2 space-y-1">
                                    {exp.roles[0].summarized_job_description.skills.map(
                                      (skill, idx) => (
                                        <li key={idx}>{skill}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                              {exp.roles[0].summarized_job_description
                                .requirements && (
                                <div>
                                  <h4 className="font-medium text-xs">
                                    Requirements:
                                  </h4>
                                  <ul className="list-disc list-inside text-gray-600 text-xs pl-2 space-y-1">
                                    {exp.roles[0].summarized_job_description.requirements.map(
                                      (req, idx) => (
                                        <li key={idx}>{req}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                            {exp.roles[0].summarized_job_description.sources &&
                              exp.roles[0].summarized_job_description.sources
                                .length > 0 && (
                                <div className="mt-2 pt-2 border-t border-purple-100">
                                  <p className="text-xs text-gray-500">
                                    Sources:
                                  </p>
                                  <div className="mt-1 space-y-1 w-[500px]">
                                    {exp.roles[0].summarized_job_description.sources.map(
                                      (source, idx) => (
                                        <a
                                          key={idx}
                                          href={source}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block text-xs text-purple-600 hover:text-purple-800 hover:underline truncate text-nowrap w-full"
                                        >
                                          {source}
                                        </a>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Multiple roles experience
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              {exp.company_linkedin_profile_url ? (
                                <a
                                  href={exp.company_linkedin_profile_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-base font-medium text-purple-900 hover:text-purple-900 hover:underline inline-flex items-center gap-1"
                                >
                                  {exp.company}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <p className="text-base font-medium text-purple-900">
                                  {exp.company}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs text-purple-600 border-purple-200"
                            >
                              {calculateTenure(
                                exp.overall_start,
                                exp.overall_end || null
                              )}
                            </Badge>
                          </div>
                          {exp.funding_stages_during_tenure &&
                            formatFundingStages(
                              exp.funding_stages_during_tenure
                            ) && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 mt-1"
                              >
                                {formatFundingStages(
                                  exp.funding_stages_during_tenure
                                )}
                              </Badge>
                            )}
                        </div>

                        <div className="space-y-4 pt-2">
                          {exp.roles.map((role, roleIndex) => (
                            <div
                              key={roleIndex}
                              className={`${
                                roleIndex !== 0
                                  ? "border-t border-purple-100/50 pt-4"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-purple-800">
                                  {role.title}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="text-xs text-purple-600/75 border-purple-200/75"
                                >
                                  {calculateTenure(
                                    role.starts_at,
                                    role.ends_at || null
                                  )}
                                </Badge>
                              </div>
                              <p className="text-xs text-purple-600/75">
                                {formatDate(role.starts_at)} -{" "}
                                {role.ends_at
                                  ? formatDate(role.ends_at)
                                  : "Present"}
                              </p>
                              {role.description && (
                                <div className="mt-2">
                                  <p className="text-sm text-muted-foreground">
                                    {role.description}
                                  </p>
                                </div>
                              )}
                              {role.summarized_job_description && (
                                <div className="mt-3 p-3 bg-purple-50 rounded-md">
                                  <p className="text-sm text-gray-700 font-medium">
                                    Generated Job Description
                                  </p>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium text-xs">
                                        Role Summary:
                                      </h4>
                                      <p className="text-gray-600 text-xs">
                                        {
                                          role.summarized_job_description
                                            .role_summary
                                        }
                                      </p>
                                    </div>

                                    {role.summarized_job_description.skills && (
                                      <div>
                                        <h4 className="font-medium text-xs">
                                          Skills:
                                        </h4>
                                        <ul className="list-disc list-inside text-gray-600 text-xs pl-2 space-y-1">
                                          {role.summarized_job_description.skills.map(
                                            (skill, idx) => (
                                              <li key={idx}>{skill}</li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}

                                    {role.summarized_job_description
                                      .requirements && (
                                      <div>
                                        <h4 className="font-medium text-xs">
                                          Requirements:
                                        </h4>
                                        <ul className="list-disc list-inside text-gray-600 text-xs pl-2 space-y-1">
                                          {role.summarized_job_description.requirements.map(
                                            (req, idx) => (
                                              <li key={idx}>{req}</li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                  {role.summarized_job_description.sources &&
                                    role.summarized_job_description.sources
                                      .length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-purple-100">
                                        <p className="text-xs text-gray-500">
                                          Sources:
                                        </p>
                                        <div className="mt-1 space-y-1 w-[500px]">
                                          {role.summarized_job_description.sources.map(
                                            (source, idx) => (
                                              <a
                                                key={idx}
                                                href={source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-xs text-purple-600 hover:text-purple-800 hover:underline truncate text-nowrap w-full"
                                              >
                                                {source}
                                              </a>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
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
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-purple-900">
                          {edu.school}
                        </p>
                        {edu.university_tier &&
                          edu.university_tier !== "other" && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {edu.university_tier
                                .replace("_", " ")
                                .toUpperCase()}
                            </Badge>
                          )}
                      </div>
                      <p className="text-sm text-purple-700/90">
                        {edu.degree_name && edu.field_of_study
                          ? `${edu.degree_name} in ${edu.field_of_study}`
                          : edu.degree_name || edu.field_of_study}
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
