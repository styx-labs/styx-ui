import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Candidate } from "@/types/index";
import { CandidateActions } from "../list/CandidateActions";

interface CandidateHeaderProps {
  candidate: Candidate;
  jobId: string;
  loadingStates: { [key: string]: { email: boolean; message: boolean } };
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onEmail: (url: string, id: string) => Promise<void>;
  onReachout: (id: string, format: string) => Promise<void>;
  onDelete: (e: React.MouseEvent, id: string) => Promise<void>;
  onFavorite?: (id: string) => Promise<void>;
}

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({
  candidate,
  jobId,
  loadingStates,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  onEmail,
  onReachout,
  onDelete,
  onFavorite,
}) => {
  return (
    <div className="sticky top-0 z-10 p-6 border-b bg-background/80 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-purple-950">
              {candidate.name}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-base text-purple-700/90">
            {candidate.profile?.occupation}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CandidateActions
            candidate={candidate}
            jobId={jobId}
            loadingStates={loadingStates}
            handleEmail={onEmail}
            handleReachout={onReachout}
            handleDelete={onDelete}
            handleFavorite={onFavorite}
          />

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
      </div>
    </div>
  );
};
