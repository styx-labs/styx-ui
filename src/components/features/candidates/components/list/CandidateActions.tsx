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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  LinkedinIcon,
  Mail,
  MessageSquarePlus,
  Loader2,
  Trash2,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Gauge,
} from "lucide-react";
import type { Candidate } from "@/types/index";

interface CandidateActionsProps {
  candidate: Candidate;
  jobId: string;
  loadingStates: { [key: string]: { email: boolean; message: boolean } };
  handleEmail: (url: string, id: string) => Promise<void>;
  handleReachout: (id: string, format: string) => Promise<void>;
  handleDelete: (e: React.MouseEvent, id: string) => Promise<void>;
  handleFavorite?: (id: string) => Promise<void>;
  setSelectedCandidate?: (candidate: Candidate) => void;
}

export const CandidateActions: React.FC<CandidateActionsProps> = ({
  candidate,
  jobId,
  loadingStates,
  handleEmail,
  handleReachout,
  handleDelete,
  handleFavorite,
  setSelectedCandidate,
}) => {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider delayDuration={100}>
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
                  window.open(candidate.url, "_blank");
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

      {handleFavorite && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (candidate.id) {
                    await handleFavorite(candidate.id);
                  }
                }}
              >
                <Star
                  className={`h-4 w-4 ${
                    candidate.favorite
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {candidate.favorite
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider delayDuration={100}>
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
                  await handleEmail(candidate.url, candidate.id!);
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

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex">
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
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuLabel>Choose Message Format</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReachout(candidate.id!, "linkedin");
                    }}
                    className="gap-2"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                    <span className="cursor-pointer">LinkedIn Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReachout(candidate.id!, "email");
                    }}
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="cursor-pointer">Email Message</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipTrigger>
          <TooltipContent>Generate Outreach Message</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => handleDelete(e, candidate.id!)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Candidate</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {setSelectedCandidate && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-2"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCandidate?.(candidate);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
