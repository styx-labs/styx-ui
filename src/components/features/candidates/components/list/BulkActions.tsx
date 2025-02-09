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
import type { Candidate } from "@/types/index";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiService } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface BulkActionsProps {
  selectedCandidates: string[];
  candidates: Candidate[];
  jobId: string;
  onDelete?: (ids: string[]) => Promise<void>;
  onFavorite?: (ids: string[]) => Promise<void>;
  onExport?: (ids: string[]) => void;
  onPipelineFeedback?: () => void;
}

type FitType = "good" | "bad" | "interesting";

interface FeedbackState {
  [candidateId: string]: {
    fit?: "good" | "bad";
    reasoning?: string;
  };
}

interface ValidFeedback {
  [candidateId: string]: {
    fit: "good" | "bad";
    reasoning?: string;
  };
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCandidates,
  candidates,
  jobId,
  onDelete,
  onFavorite,
  onExport,
  onPipelineFeedback,
}) => {
  const [isDetailedFeedbackOpen, setIsDetailedFeedbackOpen] = useState(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (selectedCandidates.length === 0) return null;

  const handleBulkDelete = async () => {
    if (!onDelete) return;
    await onDelete(selectedCandidates);
  };

  const handleBulkFavorite = async () => {
    if (!onFavorite) return;
    await onFavorite(selectedCandidates);
  };

  const handleExport = () => {
    if (!onExport) return;
    onExport(selectedCandidates);
  };

  const handleDetailedFeedbackSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Filter out empty feedback entries and ensure valid types
      const validFeedback = Object.entries(feedbackState).reduce(
        (acc, [id, feedback]) => {
          // Only include entries that have a valid fit rating
          if (feedback.fit === "good" || feedback.fit === "bad") {
            acc[id] = {
              fit: feedback.fit,
              ...(feedback.reasoning?.trim()
                ? { reasoning: feedback.reasoning.trim() }
                : {}),
            };
          }
          return acc;
        },
        {} as ValidFeedback
      );

      if (Object.keys(validFeedback).length === 0) {
        toast({
          title: "No feedback provided",
          description: "Please provide at least one rating.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      await apiService.submitBulkRecalibration(jobId, validFeedback);
      toast({
        title: "Feedback submitted",
        description: "Thank you for helping us improve our evaluation system.",
      });
      setFeedbackState({});
      setIsDetailedFeedbackOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCandidateObjects = candidates.filter(
    (c) => c.id && selectedCandidates.includes(c.id)
  );
  const allFavorited =
    selectedCandidateObjects.length > 0 &&
    selectedCandidateObjects.every((c) => c.favorite);

  const setFit = (candidateId: string, fit: "good" | "bad") => {
    setFeedbackState((prev) => {
      const newState = { ...prev };
      // Toggle the fit if it's already selected
      if (prev[candidateId]?.fit === fit) {
        delete newState[candidateId]?.fit;
        // Remove the entry if there's no feedback at all
        if (!newState[candidateId]?.reasoning) {
          delete newState[candidateId];
        }
      } else {
        newState[candidateId] = { ...prev[candidateId], fit };
      }
      return newState;
    });
  };

  const setReasoning = (candidateId: string, reasoning: string) => {
    setFeedbackState((prev) => {
      const newState = { ...prev };
      if (reasoning.trim()) {
        newState[candidateId] = { ...prev[candidateId], reasoning };
      } else {
        // Remove reasoning if empty
        delete newState[candidateId]?.reasoning;
        // Remove the entry if there's no feedback at all
        if (!newState[candidateId]?.fit) {
          delete newState[candidateId];
        }
      }
      return newState;
    });
  };

  // Remove the allCandidatesRated check since feedback is optional
  const hasAnyFeedback = Object.values(feedbackState).some(
    (feedback) => feedback.fit || feedback.reasoning?.trim()
  );

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        {selectedCandidates.length} selected
      </span>

      <Dialog
        open={isDetailedFeedbackOpen}
        onOpenChange={setIsDetailedFeedbackOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Gauge className="h-4 w-4" />
            Rate Selected ({selectedCandidates.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader className="px-6 py-4">
            <DialogTitle>Rate Selected Candidates</DialogTitle>
            <DialogDescription>
              Provide optional feedback about any of the selected candidates to
              help improve our evaluation system. You can rate candidates and/or
              leave comments.
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
                        onClick={() => setFit(candidate.id!, "good")}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          feedbackState[candidate.id!]?.fit === "bad"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setFit(candidate.id!, "bad")}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Optional: Add any comments about this candidate..."
                    value={feedbackState[candidate.id!]?.reasoning || ""}
                    onChange={(e) =>
                      setReasoning(candidate.id!, e.target.value)
                    }
                    className="resize-none h-[100px]"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t mt-auto">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {Object.keys(feedbackState).length} of{" "}
                {selectedCandidates.length} candidates have feedback
              </p>
              <Button
                disabled={!hasAnyFeedback || isSubmitting}
                onClick={handleDetailedFeedbackSubmit}
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
