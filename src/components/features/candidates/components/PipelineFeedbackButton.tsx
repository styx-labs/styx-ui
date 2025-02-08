import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Gauge, Loader2 } from "lucide-react";
import { apiService } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface PipelineFeedbackButtonProps {
  jobId: string;
  variant?: "outline" | "default" | "secondary" | "ghost";
}

export const PipelineFeedbackButton: React.FC<PipelineFeedbackButtonProps> = ({
  jobId,
  variant = "outline",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiService.submitPipelineFeedback(jobId, feedback);
      toast({
        title: "Feedback submitted",
        description: "Thank you for helping us improve our pipeline.",
      });
      setFeedback("");
      setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" className="gap-2">
          <Gauge className="h-4 w-4" />
          Calibrate Pipeline
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pipeline Feedback</DialogTitle>
          <DialogDescription>
            Provide feedback about the overall quality of candidates in this
            pipeline. This helps us improve our sourcing and evaluation system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="What do you think about the quality of candidates being surfaced? How could we improve our sourcing and evaluation?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="resize-none"
            rows={5}
          />
          <div className="flex justify-end">
            <Button
              disabled={!feedback.trim() || isSubmitting}
              onClick={handleSubmit}
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
  );
};
