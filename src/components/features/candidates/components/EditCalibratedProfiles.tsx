import React, { useState } from "react";
import { Job, CalibratedProfile } from "@/types/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  UserCircle2,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/api";

interface EditCalibratedProfilesProps {
  job: Job;
}

export const EditCalibratedProfiles: React.FC<EditCalibratedProfilesProps> = ({
  job,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profiles, setProfiles] = useState<CalibratedProfile[]>(
    job.calibrated_profiles?.length
      ? [...job.calibrated_profiles]
      : [{ url: "", reasoning: "" }]
  );

  const handleSubmit = async () => {
    if (!job.id) return;

    setIsSubmitting(true);
    try {
      const hasInvalidProfiles = profiles.some(
        (profile) => !profile.url || (!profile.fit && !profile.reasoning)
      );

      if (hasInvalidProfiles) {
        throw new Error("Please fill in all required fields for each profile");
      }

      const updatedProfiles = profiles.map((profile) => ({
        url: profile.url.trim(),
        fit: profile.fit,
        reasoning: profile.reasoning?.trim() || "",
      }));

      await apiService.updateCalibratedProfiles(job.id, updatedProfiles);

      setProfiles(updatedProfiles);

      toast({
        title: "Success",
        description: "Calibrated profiles updated successfully",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating profiles:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profiles",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserCircle2 className="h-4 w-4" />
          Edit Calibrated Profiles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Calibrated Profiles</DialogTitle>
          <DialogDescription>
            Add profiles that will help calibrate the job requirements. These
            profiles will be used as examples to improve our evaluation system.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {profiles.map((profile, index) => (
              <div
                key={index}
                className="space-y-4 pb-6 border-b last:border-b-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="LinkedIn Profile URL"
                      value={profile.url}
                      onChange={(e) =>
                        setProfiles(
                          profiles.map((p, i) =>
                            i === index ? { ...p, url: e.target.value } : p
                          )
                        )
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={profile.fit === "good" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setProfiles(
                          profiles.map((p, i) =>
                            i === index ? { ...p, fit: "good" } : p
                          )
                        )
                      }
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Good Fit
                    </Button>
                    <Button
                      variant={profile.fit === "bad" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setProfiles(
                          profiles.map((p, i) =>
                            i === index ? { ...p, fit: "bad" } : p
                          )
                        )
                      }
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Bad Fit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setProfiles(profiles.filter((_, i) => i !== index))
                      }
                      disabled={profiles.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Why is this a good/bad fit? This helps us improve our evaluation."
                  value={profile.reasoning || ""}
                  onChange={(e) =>
                    setProfiles(
                      profiles.map((p, i) =>
                        i === index ? { ...p, reasoning: e.target.value } : p
                      )
                    )
                  }
                  className="resize-none"
                />
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() =>
                setProfiles([...profiles, { url: "", reasoning: "" }])
              }
            >
              <Plus className="h-4 w-4" />
              Add Profile
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
