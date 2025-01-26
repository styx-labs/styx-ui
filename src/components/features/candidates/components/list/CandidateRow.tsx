import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/index";
import { CandidateActions } from "./CandidateActions";
import { getFitScoreLabel } from "../../utils/traitHelpers";

interface CandidateRowProps {
  candidate: Candidate;
  loadingStates: { [key: string]: { email: boolean; message: boolean } };
  onSelect: (candidate: Candidate) => void;
  onLinkedIn: (url: string) => void;
  onEmail: (url: string, id: string) => Promise<void>;
  onReachout: (id: string, format: string) => Promise<void>;
  onDelete: (e: React.MouseEvent, id: string) => Promise<void>;
}

export const CandidateRow: React.FC<CandidateRowProps> = ({
  candidate,
  loadingStates,
  onSelect,
  onLinkedIn,
  onEmail,
  onReachout,
  onDelete,
}) => {
  return (
    <TableRow
      className="cursor-pointer hover:bg-purple-50/50"
      onClick={() => onSelect(candidate)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <span className="text-purple-900">{candidate.name}</span>
        </div>
      </TableCell>
      <TableCell className="max-w-[200px]">
        <div className="flex flex-col truncate">
          <span className="font-medium text-purple-800 truncate">
            {candidate.profile?.occupation}
          </span>
          {candidate.profile?.experiences?.[0]?.company && (
            <span className="text-sm text-purple-600/75 truncate">
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
              <Badge
                variant={variant}
                className={cn(
                  "font-medium hover:bg-inherit",
                  candidate.fit !== undefined &&
                    candidate.fit >= 3 &&
                    "bg-green-100 text-green-700 hover:bg-green-100",
                  candidate.fit !== undefined &&
                    candidate.fit === 2 &&
                    "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
                  candidate.fit !== undefined &&
                    candidate.fit <= 1 &&
                    "bg-red-100 text-red-700 hover:bg-red-100"
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
              candidate.required_met === candidate.required_total
                ? "secondary"
                : "outline"
            }
            className="mb-1"
          >
            {candidate.required_met}/{candidate.required_total} Required
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            {candidate.optional_met}/{candidate.optional_total} Optional
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1.5">
          {candidate.sections?.map((section) => (
            <div
              key={section.section}
              className={cn(
                "px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5",
                section.value === true
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200",
                section.required ? "shadow-sm" : "opacity-75"
              )}
            >
              <span>{section.section}</span>
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <CandidateActions
          candidate={candidate}
          loadingStates={loadingStates}
          onLinkedIn={onLinkedIn}
          onEmail={onEmail}
          onReachout={onReachout}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};
