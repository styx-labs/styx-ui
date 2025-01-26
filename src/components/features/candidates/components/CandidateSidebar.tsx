import React, { useEffect, useRef } from "react";
import { Candidate } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  X,
  Building2,
  GraduationCap,
  BriefcaseIcon,
  LinkIcon,
  XCircle,
  CheckCircle,
} from "lucide-react";

interface CandidateSidebarProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  candidate,
  onClose,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!candidate) return null;

  const getTraitsMet = () => {
    if (!candidate.sections) return 0;
    return candidate.sections.filter((section) => section.value === true)
      .length;
  };

  const getTotalTraits = () => {
    return candidate.sections?.length || 0;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] border-l bg-background shadow-lg animate-in slide-in-from-right">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{candidate.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Building2 className="h-3.5 w-3.5" />
                {candidate.profile?.occupation}
                {candidate.profile?.experiences?.[0]?.company && (
                  <span>at {candidate.profile.experiences[0].company}</span>
                )}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Trait Match</h3>
              <Badge
                variant={
                  getTraitsMet() === getTotalTraits() ? "secondary" : "outline"
                }
              >
                {getTraitsMet()}/{getTotalTraits()}
              </Badge>
            </div>
            <div className="space-y-2">
              {candidate.sections?.map((section) => (
                <div
                  key={section.section}
                  className={`flex items-center gap-2 text-sm p-2 rounded-md ${
                    section.value === true
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {section.value === true ? (
                    <CheckCircle className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0" />
                  )}
                  <span className="font-medium">{section.section}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          {/* Summary Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Summary</h3>
            <p className="text-sm text-muted-foreground">{candidate.summary}</p>
          </div>

          <Separator className="my-6" />

          {/* Profile Section */}
          <div className="space-y-6">
            <h3 className="font-medium">Profile</h3>
            {candidate.profile && (
              <div className="space-y-6">
                {/* Experience */}
                {candidate.profile.experiences &&
                  candidate.profile.experiences.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <BriefcaseIcon className="h-4 w-4" />
                        Experience
                      </h4>
                      <div className="space-y-4">
                        {candidate.profile.experiences.map((exp, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-2">
                              <div>
                                <p className="font-medium">{exp.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {exp.company}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {exp.starts_at} - {exp.ends_at || "Present"}
                                </p>
                              </div>
                              {exp.description && (
                                <p className="text-sm text-muted-foreground">
                                  {exp.description}
                                </p>
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
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Education
                      </h4>
                      <div className="space-y-4">
                        {candidate.profile.education.map((edu, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-1">
                              <p className="font-medium">{edu.school}</p>
                              <p className="text-sm text-muted-foreground">
                                {edu.degree_name} in {edu.field_of_study}
                              </p>
                              {edu.starts_at && edu.ends_at && (
                                <p className="text-xs text-muted-foreground">
                                  {edu.starts_at} - {edu.ends_at}
                                </p>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Trait Breakdown */}
          <div className="space-y-4">
            <h3 className="font-medium">Detailed Trait Analysis</h3>
            <div className="space-y-4">
              {candidate.sections?.map((section) => (
                <Card key={section.section} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        {section.value === true ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {section.section}
                      </h4>
                      <Badge
                        variant={
                          section.value === true ? "secondary" : "outline"
                        }
                        className={section.value === true ? "bg-green-100" : ""}
                      >
                        {section.value === true ? "Match" : "No Match"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {section.content}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Sources */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Sources
            </h3>
            <div className="space-y-4">
              {candidate.citations?.map((citation, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Source {index + 1}
                      <LinkIcon className="h-3 w-3" />
                    </a>
                    <p className="text-sm text-muted-foreground">
                      {citation.distilled_content}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
