import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/api";
import type { RecalibrationFeedback, BulkRecalibrationFeedback } from "@/types";

interface UseRecalibrationProps {
  jobId: string;
}

export const useRecalibration = ({ jobId }: UseRecalibrationProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRecalibration = async (
    candidateId: string,
    feedback: RecalibrationFeedback
  ) => {
    setIsSubmitting(true);
    try {
      const response = await apiService.submitCandidateRecalibration(
        jobId,
        candidateId,
        feedback
      );

      if (response.status === 200) {
        toast({
          title: "Feedback submitted",
          description: "Your feedback has been recorded successfully.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitBulkRecalibration = async (
    feedback: BulkRecalibrationFeedback
  ) => {
    setIsSubmitting(true);
    try {
      const response = await apiService.submitBulkRecalibration(
        jobId,
        feedback
      );

      if (response.status === 200) {
        toast({
          title: "Feedback submitted",
          description: `Successfully recalibrated ${
            Object.keys(feedback).length
          } candidates.`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error submitting bulk feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitRecalibration,
    submitBulkRecalibration,
  };
};
