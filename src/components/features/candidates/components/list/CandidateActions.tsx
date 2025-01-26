import React from "react";
import { Button } from "@/components/ui/button";
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
import {
  LinkedinIcon,
  Mail,
  MessageSquarePlus,
  Loader2,
  Trash2,
} from "lucide-react";
import type { Candidate } from "@/types/index";

interface CandidateActionsProps {
  candidate: Candidate;
  loadingStates: { [key: string]: { email: boolean; message: boolean } };
  onLinkedIn: (url: string) => void;
  onEmail: (url: string, id: string) => Promise<void>;
  onReachout: (id: string, format: string) => Promise<void>;
  onDelete: (e: React.MouseEvent, id: string) => Promise<void>;
}

export const CandidateActions: React.FC<CandidateActionsProps> = ({
  candidate,
  loadingStates,
  onLinkedIn,
  onEmail,
  onReachout,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled={!candidate.url}
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                if (candidate.url) {
                  onLinkedIn(candidate.url);
                }
              }}
            >
              <LinkedinIcon className="h-4 w-4 text-[#0A66C2]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {candidate.url
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
              disabled={!candidate.url}
              size="icon"
              className="h-8 w-8"
              onClick={async (e) => {
                e.stopPropagation();
                if (candidate.url) {
                  await onEmail(candidate.url, candidate.id!);
                }
              }}
            >
              {loadingStates[candidate.id!]?.email ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {candidate.url ? "Grab Email" : "No LinkedIn URL available"}
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
                  disabled={!candidate.id}
                  onClick={(e) => e.stopPropagation()}
                >
                  {loadingStates[candidate.id!]?.message ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquarePlus className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Choose Message Format</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onReachout(candidate.id!, "linkedin")}
                  className="gap-2"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  <span>LinkedIn Message</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onReachout(candidate.id!, "email")}
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

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => onDelete(e, candidate.id!)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Candidate</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
