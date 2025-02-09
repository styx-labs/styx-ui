import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/index";
import { CandidateActions } from "./CandidateActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, X, Star } from "lucide-react";
import {
  getFitScoreLabel,
  getTotalRequiredTraits,
  getTotalOptionalTraits,
  getRequiredTraitsMet,
} from "../../utils/traitHelpers";
import { Checkbox } from "@/components/ui/checkbox";

interface CandidateRowProps {
  candidate: Candidate;
  jobId: string;
  loadingStates: {
    [key: string]: { email: boolean; message: boolean };
  };
  handleEmail: (url: string, candidateId: string) => Promise<void>;
  handleReachout: (candidateId: string, format: string) => Promise<void>;
  handleDelete: (e: React.MouseEvent, candidateId: string) => Promise<void>;
  handleFavorite?: (id: string) => Promise<void>;
  setSelectedCandidate: (candidate: Candidate) => void;
  showSelection?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (checked: boolean) => void;
}

export const CandidateRow: React.FC<CandidateRowProps> = ({
  candidate,
  jobId,
  loadingStates,
  handleEmail,
  handleReachout,
  handleDelete,
  handleFavorite,
  setSelectedCandidate,
  showSelection,
  isSelected,
  onSelectionChange,
}) => {
  const renderTraitContent = (content: string) => {
    const parts = content.split(/(\[\d+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]\(([^)]+)\)/);
      if (match) {
        const [_, index, url] = match;
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            [{index}]
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => setSelectedCandidate(candidate)}
    >
      {showSelection && (
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectionChange}
            aria-label={`Select ${candidate.name}`}
          />
        </TableCell>
      )}
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
            const { variant, label } = getFitScoreLabel(candidate.fit);

            return (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help inline-flex">
                      <Badge
                        variant={variant}
                        className={cn(
                          "font-medium hover:bg-inherit",
                          candidate.fit !== undefined &&
                            candidate.fit === 4 &&
                            "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
                          candidate.fit === 3 &&
                            "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
                          candidate.fit === 2 &&
                            "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
                          candidate.fit !== undefined &&
                            candidate.fit <= 1 &&
                            "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                        )}
                      >
                        {label}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] bg-white text-muted-foreground shadow-md">
                    <p className="text-sm">{candidate.summary}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })()}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          {getTotalRequiredTraits(candidate) > 0 && (
            <Badge
              variant={
                candidate.required_met === getTotalRequiredTraits(candidate)
                  ? "secondary"
                  : "outline"
              }
              className={cn(
                "mb-1 bg-purple-100 hover:bg-purple-100",
                getRequiredTraitsMet(candidate) ===
                  getTotalRequiredTraits(candidate)
                  ? "text-purple-700 border-purple-200"
                  : "text-purple-600 border-purple-200"
              )}
            >
              {candidate.required_met}/{getTotalRequiredTraits(candidate)}{" "}
              Required
            </Badge>
          )}
          {getTotalOptionalTraits(candidate) > 0 && (
            <Badge
              variant="outline"
              className="text-purple-600 border-purple-200"
            >
              {candidate.optional_met}/{getTotalOptionalTraits(candidate)}{" "}
              Optional
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1.5">
          <TooltipProvider delayDuration={100}>
            {candidate.sections
              ?.sort((a, b) => {
                // Sort by required first, then alphabetically
                if (a.required !== b.required) {
                  return a.required ? -1 : 1;
                }
                return a.section.localeCompare(b.section);
              })
              .map((section) => (
                <Tooltip key={section.section}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-help",
                        section.value === true
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200",
                        section.required ? "shadow-sm" : "opacity-75"
                      )}
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
                  <TooltipContent className="max-w-[300px] bg-white text-muted-foreground shadow-md">
                    <div className="space-y-1">
                      <p className="text-sm">
                        {renderTraitContent(section.content)}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <CandidateActions
          candidate={candidate}
          jobId={jobId}
          loadingStates={loadingStates}
          handleEmail={handleEmail}
          handleReachout={handleReachout}
          handleDelete={handleDelete}
          handleFavorite={handleFavorite}
          setSelectedCandidate={setSelectedCandidate}
        />
      </TableCell>
    </TableRow>
  );
};
