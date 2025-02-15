import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Candidate, RecalibrationFeedback } from "@/types/index";
import { useRecalibration } from "@/hooks/useRecalibration";

interface CandidateRecalibrationProps {
  candidate: Candidate;
  jobId: string;
  onRefresh?: () => void;
}

export const CandidateRecalibration: React.FC<CandidateRecalibrationProps> = ({
  candidate,
  jobId,
  onRefresh,
}) => {
  const [isGoodFitOpen, setIsGoodFitOpen] = useState(false);
  const [isBadFitOpen, setIsBadFitOpen] = useState(false);
  const [feedback, setFeedback] = useState<Partial<RecalibrationFeedback>>({
    reasoning: "",
  });

  const { isSubmitting, submitRecalibration } = useRecalibration({ jobId });

  const handleRecalibrationSubmit = async (fit: "good" | "bad") => {
    if (!candidate.id) return;

    const success = await submitRecalibration(candidate.id, {
      fit,
      reasoning: feedback.reasoning || "",
    });
    if (success) {
      setIsGoodFitOpen(false);
      setIsBadFitOpen(false);
      setFeedback({ fit: undefined, reasoning: "" });
      onRefresh?.();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col space-y-3">
        <p className="text-sm text-muted-foreground">Tell our AI what you think about this candidate</p>
        <div className="flex gap-3">
          <Popover open={isGoodFitOpen} onOpenChange={setIsGoodFitOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <ThumbsUp className="h-4 w-4 text-green-500 mr-2" />
                Good Fit
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Why is this a good fit?</h4>
                <Textarea
                  placeholder="Please explain why this candidate is a good fit. This helps us improve our evaluation."
                  value={feedback.reasoning || ""}
                  onChange={(e) =>
                    setFeedback((f) => ({
                      ...f,
                      reasoning: e.target.value,
                    }))
                  }
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => handleRecalibrationSubmit("good")}
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
            </PopoverContent>
          </Popover>

          <Popover open={isBadFitOpen} onOpenChange={setIsBadFitOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <ThumbsDown className="h-4 w-4 text-red-500 mr-2" />
                Bad Fit
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Why is this a bad fit?</h4>
                <Textarea
                  placeholder="Please explain why this candidate is not a good fit. This helps us improve our evaluation."
                  value={feedback.reasoning || ""}
                  onChange={(e) =>
                    setFeedback((f) => ({
                      ...f,
                      reasoning: e.target.value,
                    }))
                  }
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => handleRecalibrationSubmit("bad")}
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
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}; 