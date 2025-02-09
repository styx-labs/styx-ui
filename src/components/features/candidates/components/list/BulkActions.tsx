import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Star,
  Trash2,
  Download,
  Gauge,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react";
import type { Candidate, BulkRecalibrationFeedback } from "@/types/index";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRecalibration } from "@/hooks/useRecalibration";

interface BulkActionsProps {
  selectedCandidates: string[];
  candidates: Candidate[];
  jobId: string;
  onDelete?: (ids: string[]) => Promise<void>;
  onFavorite?: (ids: string[], favorite: boolean) => Promise<void>;
  onExport?: (ids: string[]) => void;
}

type PartialBulkRecalibrationFeedback = {
  [key: string]: {
    fit?: "good" | "bad";
    reasoning?: string;
  };
};

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCandidates,
  candidates,
  jobId,
  onDelete,
  onFavorite,
  onExport,
}) => {
  const [isRecalibrateOpen, setIsRecalibrateOpen] = useState(false);
  const [feedbackState, setFeedbackState] =
    useState<PartialBulkRecalibrationFeedback>({});
  const { isSubmitting, submitBulkRecalibration } = useRecalibration({ jobId });

  if (selectedCandidates.length === 0) return null;

  const handleBulkDelete = async () => {
    if (!onDelete) return;
    await onDelete(selectedCandidates);
  };

  const handleBulkFavorite = async () => {
    if (!onFavorite) return;
    const selectedCandidateObjects = candidates.filter(
      (c) => c.id && selectedCandidates.includes(c.id)
    );
    const allFavorited =
      selectedCandidateObjects.length > 0 &&
      selectedCandidateObjects.every((c) => c.favorite);
    await onFavorite(selectedCandidates, !allFavorited);
  };

  const handleExport = () => {
    if (!onExport) return;
    onExport(selectedCandidates);
  };

  const handleRecalibrationSubmit = async () => {
    const validFeedback = Object.entries(feedbackState).reduce(
      (acc, [id, feedback]) => {
        if (feedback.fit) {
          acc[id] = {
            fit: feedback.fit,
            reasoning: feedback.reasoning || "",
          };
        }
        return acc;
      },
      {} as BulkRecalibrationFeedback
    );

    if (Object.keys(validFeedback).length === 0) return;

    const success = await submitBulkRecalibration(validFeedback);
    if (success) {
      setIsRecalibrateOpen(false);
      setFeedbackState({});
    }
  };

  const setFit = (candidateId: string, fit: "good" | "bad") => {
    setFeedbackState((prev) => {
      const newState = { ...prev };
      if (prev[candidateId]?.fit === fit) {
        delete newState[candidateId];
      } else {
        newState[candidateId] = {
          ...prev[candidateId],
          fit,
        };
      }
      return newState;
    });
  };

  const setReasoning = (candidateId: string, reasoning: string) => {
    setFeedbackState((prev) => {
      const newState = { ...prev };
      if (!prev[candidateId]) {
        newState[candidateId] = { reasoning: reasoning.trim() };
      } else {
        newState[candidateId] = {
          ...prev[candidateId],
          reasoning: reasoning.trim(),
        };
      }
      return newState;
    });
  };

  const selectedCandidateObjects = candidates.filter(
    (c) => c.id && selectedCandidates.includes(c.id)
  );
  const allFavorited =
    selectedCandidateObjects.length > 0 &&
    selectedCandidateObjects.every((c) => c.favorite);

  const getFeedbackCount = () => {
    return Object.values(feedbackState).filter(
      (feedback) =>
        feedback.fit ||
        (feedback.reasoning && feedback.reasoning.trim().length > 0)
    ).length;
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">
        {selectedCandidates.length} selected
      </span>

      <Dialog open={isRecalibrateOpen} onOpenChange={setIsRecalibrateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Gauge className="h-4 w-4 mr-2" />
            Rate Selected ({selectedCandidates.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Rate Selected Candidates</DialogTitle>
            <DialogDescription>
              Provide feedback about the selected candidates to help improve our
              evaluation system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6 py-4">
              {selectedCandidateObjects.map((candidate) => (
                <div
                  key={candidate.id}
                  className="space-y-4 pb-6 border-b last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {candidate.profile?.occupation}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          feedbackState[candidate.id!]?.fit === "good"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="flex-1"
                        onClick={() => setFit(candidate.id!, "good")}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Good Fit
                      </Button>
                      <Button
                        variant={
                          feedbackState[candidate.id!]?.fit === "bad"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="flex-1"
                        onClick={() => setFit(candidate.id!, "bad")}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Bad Fit
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Why is this a good/bad fit? This helps us improve our evaluation."
                    value={feedbackState[candidate.id!]?.reasoning || ""}
                    onChange={(e) =>
                      setReasoning(candidate.id!, e.target.value)
                    }
                    className="resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              {getFeedbackCount()} of {selectedCandidates.length} candidates
              have feedback
            </p>
            <Button
              disabled={Object.keys(feedbackState).length === 0 || isSubmitting}
              onClick={handleRecalibrationSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleBulkFavorite}
      >
        <Star
          className={cn(
            "h-4 w-4",
            allFavorited && "fill-yellow-400 text-yellow-400"
          )}
        />
        {allFavorited ? "Unfavorite" : "Favorite"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleExport}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        onClick={handleBulkDelete}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};
