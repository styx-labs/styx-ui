import React, { useState } from "react";
import { Candidate } from "../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  UserPlus,
  LinkedinIcon,
  Mail,
  MessageSquarePlus,
  ChevronRight,
  Star,
  Loader2,
} from "lucide-react";
import { CandidateSidebar } from "./components/CandidateSidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CandidateListProps {
  candidates: Candidate[];
  onGetEmail?: (url: string) => Promise<void>;
  onReachout?: (id: string, format: string) => Promise<void>;
  onAddToOutreach?: (candidateId: string) => Promise<void>;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onGetEmail,
  onReachout,
  onAddToOutreach,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isGrabbingEmail, setIsGrabbingEmail] = useState(false);

  const calculateOverallScore = (candidate: Candidate) => {
    if (!candidate.sections || candidate.sections.length === 0)
      return undefined;

    const totalScore = candidate.sections.reduce((acc, section) => {
      return acc + section.normalized_score;
    }, 0);

    // Convert 0-10 scale to 0-4 scale
    return Math.min(
      4,
      Math.floor((totalScore / (candidate.sections.length * 10)) * 4)
    );
  };

  const getRequiredTraitsMet = (candidate: Candidate) => {
    if (!candidate.sections) return 0;
    return candidate.sections.filter(
      (section) => section.value === true && section.required
    ).length;
  };

  const getOptionalTraitsMet = (candidate: Candidate) => {
    if (!candidate.sections) return 0;
    return candidate.sections.filter(
      (section) => section.value === true && !section.required
    ).length;
  };

  const getTotalRequiredTraits = (candidate: Candidate) => {
    return (
      candidate.sections?.filter((section) => section.required).length || 0
    );
  };

  const getTotalOptionalTraits = (candidate: Candidate) => {
    return (
      candidate.sections?.filter((section) => !section.required).length || 0
    );
  };

  const getFitScoreLabel = (score: number | undefined) => {
    if (score === undefined)
      return { label: "Unknown", variant: "outline" as const };

    switch (score) {
      case 0:
        return { label: "Not Fit", variant: "destructive" as const };
      case 1:
        return { label: "Likely Not Fit", variant: "outline" as const };
      case 2:
        return { label: "Potential Fit", variant: "secondary" as const };
      case 3:
        return { label: "Good Fit", variant: "default" as const };
      case 4:
        return { label: "Ideal Fit", variant: "secondary" as const };
      default:
        return { label: "Unknown", variant: "outline" as const };
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[200px]">Current Position</TableHead>
            <TableHead className="text-center">AI Evaluation</TableHead>
            <TableHead className="text-center">Traits Met</TableHead>
            <TableHead>Trait Breakdown</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow
              key={candidate.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>{candidate.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <div className="flex flex-col truncate">
                  <span className="font-medium truncate">
                    {candidate.profile?.occupation}
                  </span>
                  {candidate.profile?.experiences?.[0]?.company && (
                    <span className="text-sm text-muted-foreground truncate">
                      {candidate.profile.experiences[0].company}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {candidate.sections &&
                  (() => {
                    const score = calculateOverallScore(candidate);
                    const { variant, label } = getFitScoreLabel(score);

                    return (
                      <Badge
                        variant={variant}
                        className={cn(
                          "font-medium",
                          score !== undefined &&
                            score >= 3 &&
                            "bg-green-100 text-green-700",
                          score !== undefined &&
                            score === 2 &&
                            "bg-yellow-100 text-yellow-700",
                          score !== undefined &&
                            score <= 1 &&
                            "bg-red-100 text-red-700"
                        )}
                      >
                        {label}
                      </Badge>
                    );
                  })()}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <Badge
                    variant={
                      getRequiredTraitsMet(candidate) ===
                      getTotalRequiredTraits(candidate)
                        ? "secondary"
                        : "outline"
                    }
                    className="mb-1"
                  >
                    {getRequiredTraitsMet(candidate)}/
                    {getTotalRequiredTraits(candidate)} Required
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {getOptionalTraitsMet(candidate)}/
                    {getTotalOptionalTraits(candidate)} Optional
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  <TooltipProvider>
                    {candidate.sections?.map((section) => (
                      <Tooltip key={section.section}>
                        <TooltipTrigger asChild>
                          <div
                            className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${
                              section.value === true
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            } ${section.required ? "shadow-sm" : "opacity-75"}`}
                          >
                            {section.value === true ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            <span className="flex items-center gap-1">
                              {section.section}
                              {section.required ? (
                                <Star className="h-3 w-3 fill-current opacity-75" />
                              ) : null}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] bg-zinc-950 text-zinc-50">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{section.section}</p>
                              <Badge variant="outline" className="text-xs">
                                {section.required ? "Required" : "Optional"}
                              </Badge>
                            </div>
                            <p className="text-sm">{section.content}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!candidate.profile?.url}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (candidate.profile?.url) {
                              window.open(candidate.profile.url, "_blank");
                            }
                          }}
                        >
                          <LinkedinIcon className="h-4 w-4 text-[#0A66C2]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {candidate.profile?.url
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
                          disabled={isGrabbingEmail || !candidate.profile?.url}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (onGetEmail && candidate.profile?.url) {
                              setIsGrabbingEmail(true);
                              try {
                                await onGetEmail(candidate.profile.url);
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
                        {candidate.profile?.url
                          ? "Grab Email"
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
                          disabled={isGeneratingMessage || !candidate.id}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (onReachout && candidate.id) {
                              setIsGeneratingMessage(true);
                              try {
                                await onReachout(candidate.id, "linkedin");
                              } finally {
                                setIsGeneratingMessage(false);
                              }
                            }
                          }}
                        >
                          {isGeneratingMessage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MessageSquarePlus className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Generate Outreach Message</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={!candidate.id}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (onAddToOutreach && candidate.id) {
                        await onAddToOutreach(candidate.id);
                      }
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidate(candidate);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CandidateSidebar
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
};
