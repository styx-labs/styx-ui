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
  onUpdate?: (updatedProfiles: CalibratedProfile[]) => void;
}

const validateLinkedInUrl = (url: string): boolean => {
  const linkedInRegex =
    /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return linkedInRegex.test(url);
};

export const EditCalibratedProfiles: React.FC<EditCalibratedProfilesProps> = ({
  job,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string>("");
  const [profiles, setProfiles] = useState<CalibratedProfile[]>(
    job.calibrated_profiles?.length
      ? [...job.calibrated_profiles]
      : [{ url: "", reasoning: "", type: "ideal", fit: undefined }]
  );

  // Reset profiles state when dialog opens to get latest data
  React.useEffect(() => {
    if (open) {
      setProfiles(
        job.calibrated_profiles?.length
          ? [...job.calibrated_profiles]
          : [{ url: "", reasoning: "", type: "ideal", fit: undefined }]
      );
    }
  }, [open, job.calibrated_profiles]);

  const handleSubmit = async () => {
    if (!job.id) return;

    setIsSubmitting(true);
    try {
      const hasInvalidProfiles = profiles.some((profile) => {
        if (!profile.url || (!profile.fit && !profile.reasoning)) return true;
        // Only validate URL format for new profiles (those without profile data)
        if (!profile.profile && !validateLinkedInUrl(profile.url)) {
          setUrlError(
            "Please enter a valid LinkedIn URL (format: https://www.linkedin.com/in/username)"
          );
          return true;
        }
        return false;
      });

      if (hasInvalidProfiles) {
        throw new Error(
          "Please fill in all required fields and ensure valid LinkedIn URLs"
        );
      }

      const updatedProfiles = profiles.map((profile) => ({
        ...profile,
        url: profile.url.trim(),
        reasoning: profile.reasoning?.trim() || "",
        type: profile.type || "ideal",
      }));

      const response = await apiService.updateCalibratedProfiles(
        job.id,
        updatedProfiles
      );

      if (response.data.success) {
        // Update local state with the profiles we just sent
        setProfiles(response.data.calibrated_profiles);
        // Update parent component's job state
        job.calibrated_profiles = response.data.calibrated_profiles;
        onUpdate?.(response.data.calibrated_profiles);

        toast({
          title: "Success",
          description: "Calibrated profiles updated successfully",
        });
        setOpen(false);
      }
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

  const renderProfile = (profile: CalibratedProfile, index: number) => (
    <div key={index} className="space-y-4 py-6 border-b last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {profile.profile ? (
            <div>
              <div className="font-semibold">{profile.profile.full_name}</div>
              <div className="text-sm text-gray-500">
                {profile.profile.headline}
              </div>
            </div>
          ) : (
            <div>
              <Input
                placeholder="LinkedIn Profile URL"
                value={profile.url}
                onChange={(e) => {
                  setUrlError("");
                  setProfiles(
                    profiles.map((p, i) =>
                      i === index ? { ...p, url: e.target.value } : p
                    )
                  );
                }}
              />
              {urlError && index === profiles.length - 1 && (
                <p className="text-sm text-destructive mt-1">{urlError}</p>
              )}
            </div>
          )}
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
                profiles.map((p, i) => (i === index ? { ...p, fit: "bad" } : p))
              )
            }
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Bad Fit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setProfiles(profiles.filter((_, i) => i !== index))}
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
  );

  const idealProfiles = profiles.filter((p) => p.type === "ideal" && p.profile);
  const pipelineProfiles = profiles.filter(
    (p) => p.type === "pipeline" && p.profile
  );
  const newProfiles = profiles.filter((p) => !p.profile);

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
            {idealProfiles.length > 0 && (
              <div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold mb-2">
                    Hypothetical Profiles
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    These are profiles that aren't in your pipeline, but are
                    benchmarks for an ideal candidate.
                  </p>
                </div>
                {idealProfiles.map((profile) =>
                  renderProfile(profile, profiles.indexOf(profile))
                )}
              </div>
            )}
            {pipelineProfiles.length > 0 && (
              <div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold mb-2">
                    Profiles in Pipeline
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    These are profiles that are in your pipeline that you have
                    rated.
                  </p>
                </div>
                {pipelineProfiles.map((profile) =>
                  renderProfile(profile, profiles.indexOf(profile))
                )}
              </div>
            )}
            {newProfiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">New Profiles</h3>
                {newProfiles.map((profile) =>
                  renderProfile(profile, profiles.indexOf(profile))
                )}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() =>
                setProfiles([
                  ...profiles,
                  { url: "", reasoning: "", type: "ideal", fit: undefined },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add Hypothetical Profile
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
