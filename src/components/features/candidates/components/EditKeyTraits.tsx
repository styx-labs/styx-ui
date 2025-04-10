import React, { useState } from "react";
import { TraitType } from "@/types/index";
import type { Job } from "@/types/index";
import { apiService } from "@/api";
import { TraitCard } from "../../create-job/components/TraitCard";
import { Button } from "@/components/ui/button";
import { Plus, GaugeCircle, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EditKeyTraitsProps {
  job: Job;
  onSuccess?: () => void;
}

export const EditKeyTraits: React.FC<EditKeyTraitsProps> = ({
  job,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const [traits, setTraits] = useState<Job["key_traits"]>(job.key_traits);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!traits.length) {
      toast({
        title: "At least one trait is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.editKeyTraits(job.id!, traits);
      toast({
        title: "Key traits updated successfully",
      });
      if (onSuccess) {
        onSuccess();
      }
      setOpen(false);
    } catch (error) {
      console.error("Error updating key traits:", error);
      toast({
        title: "Failed to update key traits",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter your feedback first",
        variant: "destructive",
      });
      return;
    }

    setIsAiSubmitting(true);
    try {
      const response = await apiService.editKeyTraitsWithAI(job.id!, prompt);
      setTraits(response.data.key_traits);
      toast({
        title: "Key traits updated with AI suggestions",
      });
      setPrompt("");
      setIsPromptOpen(false);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast({
        title: "Failed to get AI suggestions",
        variant: "destructive",
      });
    } finally {
      setIsAiSubmitting(false);
    }
  };

  const addTrait = () => {
    setTraits([
      ...traits,
      {
        trait: "",
        description: "",
        trait_type: TraitType.SCORE,
        required: false,
      },
    ]);
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const updateTrait = (
    index: number,
    updates: Partial<Job["key_traits"][0]>
  ) => {
    const newTraits = [...traits];
    newTraits[index] = { ...newTraits[index], ...updates };
    setTraits(newTraits);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <GaugeCircle className="h-4 w-4" />
          Re-Calibrate Traits
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Key Traits</DialogTitle>
          <DialogDescription>
            Update the key traits for {job.job_title} at {job.company_name}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <Collapsible
              open={isPromptOpen}
              onOpenChange={setIsPromptOpen}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Sparkles className="h-4 w-4" />
                  Edit Key Traits with AI
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <Textarea
                  placeholder="Describe how you'd like to modify the traits. For example: 'Make the traits more focused on leadership abilities' or 'Add traits related to technical skills in machine learning'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleAiSubmit} 
                  disabled={isAiSubmitting} 
                  className="w-full"
                >
                  {isAiSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Getting AI Suggestions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Suggestions
                    </>
                  )}
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {traits.map((trait, index) => (
              <TraitCard
                key={index}
                trait={trait}
                index={index}
                onRemove={removeTrait}
                onUpdate={updateTrait}
              />
            ))}

            <Button onClick={addTrait} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add another trait
            </Button>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
