import React, { useEffect, useRef, useState } from "react";
import type { Candidate } from "@/types/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  X,
  GraduationCap,
  BriefcaseIcon,
  LinkIcon,
  XCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  LinkedinIcon,
  Mail,
  MessageSquarePlus,
  Loader2,
  Star,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
interface CandidateSidebarProps {
  candidate: Candidate | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onGetEmail?: (url: string) => Promise<void>;
  onReachout?: (id: string, format: string) => Promise<void>;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const calculateTenure = (startDate: string, endDate: string | null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} mo${remainingMonths !== 1 ? "s" : ""}`;
  } else if (remainingMonths === 0) {
    return `${years} yr${years !== 1 ? "s" : ""}`;
  } else {
    return `${years} yr${years !== 1 ? "s" : ""} ${remainingMonths} mo${
      remainingMonths !== 1 ? "s" : ""
    }`;
  }
};

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  candidate,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  onGetEmail,
  onReachout,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isGrabbingEmail, setIsGrabbingEmail] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && hasPrevious) {
        onPrevious();
      } else if (event.key === "ArrowRight" && hasNext) {
        onNext();
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

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext]);

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
    <div
      ref={sidebarRef}
      className="fixed inset-y-0 right-0 w-[600px] border-l bg-background shadow-lg animate-in slide-in-from-right"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{candidate.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-base text-muted-foreground">
              {candidate.profile?.occupation}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!candidate?.url}
                    onClick={() => {
                      if (candidate?.url) {
                        window.open(candidate.url, "_blank");
                      }
                    }}
                  >
                    <LinkedinIcon className="h-4 w-4 text-[#0A66C2]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {candidate?.url
                    ? "View LinkedIn Profile"
                    : "No LinkedIn URL available"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={isGrabbingEmail || !candidate?.url}
                    onClick={async () => {
                      if (onGetEmail && candidate?.url) {
                        setIsGrabbingEmail(true);
                        try {
                          await onGetEmail(candidate.url);
                        } finally {
                          setIsGrabbingEmail(false);
                        }
                      }
                    }}
                  >
                    {isGrabbingEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {candidate?.url ? "Grab Email" : "No LinkedIn URL available"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={isGeneratingMessage || !candidate?.id}
                      >
                        {isGeneratingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MessageSquarePlus className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        Choose Message Format
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={async () => {
                          if (onReachout && candidate?.id) {
                            setIsGeneratingMessage(true);
                            try {
                              await onReachout(candidate.id, "linkedin");
                            } finally {
                              setIsGeneratingMessage(false);
                            }
                          }
                        }}
                        className="gap-2"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                        <span>LinkedIn Message</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          if (onReachout && candidate?.id) {
                            setIsGeneratingMessage(true);
                            try {
                              await onReachout(candidate.id, "email");
                            } finally {
                              setIsGeneratingMessage(false);
                            }
                          }
                        }}
                        className="gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Email Message</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>Generate Outreach Message</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-4 mx-2" />

            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              disabled={!hasNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Card className="p-4 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-purple-900">Trait Match</h3>
              <Badge
                variant={
                  getTraitsMet() === getTotalTraits() ? "secondary" : "outline"
                }
                className={cn(
                  "bg-purple-100 hover:bg-purple-100",
                  getTraitsMet() === getTotalTraits()
                    ? "text-purple-700 border-purple-200"
                    : "text-purple-600 border-purple-200"
                )}
              >
                {getTraitsMet()}/{getTotalTraits()}
              </Badge>
            </div>
            <div className="space-y-2">
              {candidate.sections?.map((section) => (
                <Collapsible key={section.section}>
                  <CollapsibleTrigger className="w-full">
                    <div
                      className={cn(
                        "flex items-center gap-2 text-sm p-2 rounded-md transition-colors hover:opacity-90",
                        section.value === true
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      )}
                    >
                      {section.value === true ? (
                        <CheckCircle className="h-4 w-4 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0" />
                      )}
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{section.section}</span>
                        {section.required && (
                          <Star className="h-3 w-3 fill-current opacity-75" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 ml-6 p-3 text-sm text-muted-foreground bg-muted rounded-md">
                      {section.content}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </Card>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          {/* Summary Section */}
          {candidate.summary && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {candidate.summary}
                </p>
              </div>
              <Separator className="my-6" />
            </>
          )}

          {/* Profile Section */}
          {candidate.profile && (
            <>
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Profile</h3>
                <div className="space-y-6">
                  {/* Experience */}
                  {candidate.profile.experiences &&
                    candidate.profile.experiences.length > 0 && (
                      <div>
                        <h4 className="text-base font-medium mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="h-4 w-4" />
                          Experience
                        </h4>
                        <div className="space-y-4">
                          {candidate.profile.experiences.map((exp, index) => (
                            <Card key={index} className="p-4">
                              <div className="space-y-2">
                                <div>
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium">{exp.title}</p>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {calculateTenure(
                                        exp.starts_at,
                                        exp.ends_at
                                      )}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {exp.company}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(exp.starts_at)} -{" "}
                                    {exp.ends_at
                                      ? formatDate(exp.ends_at)
                                      : "Present"}
                                  </p>
                                </div>
                                {exp.description && (
                                  <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                      {exp.description}
                                    </p>
                                    {exp.summarized_job_description && (
                                      <div className="mt-2 p-3 bg-purple-50/50 rounded-md border border-purple-100">
                                        <p className="text-xs font-medium text-purple-900 mb-1">
                                          AI Analysis
                                        </p>
                                        <p className="text-sm text-purple-700">
                                          {
                                            exp.summarized_job_description
                                              .role_summary
                                          }
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {exp.summarized_job_description.skills.join(
                                            ", "
                                          )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {exp.summarized_job_description.requirements.join(
                                            ", "
                                          )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {exp.summarized_job_description.sources.join(
                                            ", "
                                          )}
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
                      <div>
                        <h4 className="text-base font-medium mb-4 flex items-center gap-2">
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
              <Separator className="my-6" />
            </>
          )}

          {/* Sources */}
          {candidate.citations && candidate.citations.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-4">
                {candidate.citations.map((citation, index) => (
                  <Card
                    key={index}
                    className="p-4 border-purple-100 hover:border-purple-200 transition-colors"
                  >
                    <div className="space-y-2">
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1"
                      >
                        {citation.url}
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
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
