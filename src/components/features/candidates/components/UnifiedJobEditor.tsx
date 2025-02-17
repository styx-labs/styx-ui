import React, { useState, useEffect } from "react";
import { Job, CalibratedProfile, TraitType } from "@/types/index";
import { apiService } from "@/api";
import { Button } from "@/components/ui/button";
import { Settings2, Loader2, Sparkles, Plus, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TraitCard } from "../../create-job/components/TraitCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface UnifiedJobEditorProps {
  job: Job;
  onSuccess?: () => void;
  onUpdate?: (updatedProfiles: CalibratedProfile[]) => void;
}

const validateLinkedInUrl = (url: string): boolean => {
  const linkedInRegex = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return linkedInRegex.test(url);
};

export const UnifiedJobEditor: React.FC<UnifiedJobEditorProps> = ({
  job,
  onSuccess,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("traits");
  
  // Job Description State
  const [description, setDescription] = useState(job.job_description);
  const [isDescriptionSubmitting, setIsDescriptionSubmitting] = useState(false);
  const [isDescriptionAiSubmitting, setIsDescriptionAiSubmitting] = useState(false);
  const [isDescriptionPromptOpen, setIsDescriptionPromptOpen] = useState(false);
  const [descriptionPrompt, setDescriptionPrompt] = useState("");

  // Key Traits State
  const [traits, setTraits] = useState<Job["key_traits"]>(job.key_traits);
  const [isTraitsSubmitting, setIsTraitsSubmitting] = useState(false);
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Calibrated Profiles State
  const [profiles, setProfiles] = useState<CalibratedProfile[]>(
    job.calibrated_profiles?.length
      ? [...job.calibrated_profiles]
      : [{ url: "", reasoning: "", type: "ideal", fit: undefined }]
  );
  const [isProfilesSubmitting, setIsProfilesSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string>("");

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setDescription(job.job_description);
      setTraits(job.key_traits);
      setProfiles(
        job.calibrated_profiles?.length
          ? [...job.calibrated_profiles]
          : [{ url: "", reasoning: "", type: "ideal", fit: undefined }]
      );
    }
  }, [open, job]);

  const handleDescriptionSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: "Job description cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsDescriptionSubmitting(true);
    try {
      await apiService.editJobDescription(job.id!, description);
      toast({
        title: "Job description updated successfully",
      });
      if (onSuccess) {
        onSuccess();
      }
      setOpen(false);
    } catch (error) {
      console.error("Error updating job description:", error);
      toast({
        title: "Failed to update job description",
        variant: "destructive",
      });
    } finally {
      setIsDescriptionSubmitting(false);
    }
  };

  const handleTraitsSubmit = async () => {
    if (!traits.length) {
      toast({
        title: "At least one trait is required",
        variant: "destructive",
      });
      return;
    }

    setIsTraitsSubmitting(true);
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
      setIsTraitsSubmitting(false);
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

  const handleProfilesSubmit = async () => {
    if (!job.id) return;

    setIsProfilesSubmitting(true);
    try {
      const hasInvalidProfiles = profiles.some((profile) => {
        if (!profile.url || (!profile.fit && !profile.reasoning)) return true;
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
        setProfiles(response.data.calibrated_profiles);
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
      setIsProfilesSubmitting(false);
    }
  };

  const handleDescriptionAiSubmit = async () => {
    if (!descriptionPrompt.trim()) {
      toast({
        title: "Please enter your feedback first",
        variant: "destructive",
      });
      return;
    }

    setIsDescriptionAiSubmitting(true);
    try {
      const response = await apiService.editJobDescriptionWithAI(job.id!, descriptionPrompt);
      setDescription(response.data.job_description);
      toast({
        title: "Job description updated with AI suggestions",
      });
      setDescriptionPrompt("");
      setIsDescriptionPromptOpen(false);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast({
        title: "Failed to get AI suggestions",
        variant: "destructive",
      });
    } finally {
      setIsDescriptionAiSubmitting(false);
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
          <Settings2 className="h-4 w-4" />
          Recalibrate and Edit Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div>
            <DialogTitle>Edit Job Settings</DialogTitle>
            <DialogDescription>
              Update details for {job.job_title} at {job.company_name}
            </DialogDescription>
          </div>
          {activeTab === "description" && (
            <Collapsible open={isDescriptionPromptOpen} onOpenChange={setIsDescriptionPromptOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Edit Description with AI
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute z-50 top-16 right-4 w-[400px] bg-background border rounded-md shadow-lg p-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe how you'd like to modify the job description. For example: 'Candidates should be more senior' or 'Add more details about required technical skills'"
                    value={descriptionPrompt}
                    onChange={(e) => setDescriptionPrompt(e.target.value)}
                    className="min-h-[150px] w-full"
                  />
                  <Button 
                    onClick={handleDescriptionAiSubmit} 
                    disabled={isDescriptionAiSubmitting} 
                    size="sm"
                    className="w-auto"
                  >
                    {isDescriptionAiSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Editing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          {activeTab === "traits" && (
            <Collapsible open={isPromptOpen} onOpenChange={setIsPromptOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Edit Key Traits with AI
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute z-50 top-16 right-4 w-[400px] bg-background border rounded-md shadow-lg p-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe how you'd like to modify the traits. For example: 'Candidates should be more senior' or 'Add a trait for technical skills in machine learning'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[150px] w-full"
                  />
                  <Button 
                    onClick={handleAiSubmit} 
                    disabled={isAiSubmitting} 
                    size="sm"
                    className="w-auto"
                  >
                    {isAiSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Editing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </DialogHeader>

        <div className="mt-4">
          <Tabs defaultValue="traits" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex gap-6">
              <TabsList className="flex flex-col h-[60vh] bg-muted p-0 min-w-[200px] border border-border rounded-lg">
                <TabsTrigger 
                  value="traits" 
                  className="w-full justify-start px-4 py-3 rounded-none data-[state=active]:bg-background border-b border-border text-sm font-medium"
                >
                  Key Traits
                </TabsTrigger>
                <TabsTrigger 
                  value="description" 
                  className="w-full justify-start px-4 py-3 rounded-none data-[state=active]:bg-background border-b border-border text-sm font-medium"
                >
                  Job Description
                </TabsTrigger>
                <TabsTrigger 
                  value="profiles" 
                  className="w-full justify-start px-4 py-3 rounded-none data-[state=active]:bg-background text-sm font-medium"
                >
                  Calibrated Profiles
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 relative">
                <ScrollArea className="h-[60vh] pr-4">
                  <TabsContent value="description" className="space-y-4 mt-0 pb-16">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter job description..."
                      className="min-h-[400px] w-full"
                    />
                  </TabsContent>

                  <TabsContent value="traits" className="space-y-4 mt-0 pb-16">
                    {traits.map((trait, index) => (
                      <TraitCard
                        key={index}
                        trait={trait}
                        index={index}
                        onRemove={removeTrait}
                        onUpdate={updateTrait}
                      />
                    ))}

                    <Button onClick={addTrait} variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add another trait
                    </Button>
                  </TabsContent>

                  <TabsContent value="profiles" className="space-y-6 mt-0 pb-16">
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
                      className="w-full justify-start"
                      onClick={() =>
                        setProfiles([
                          ...profiles,
                          { url: "", reasoning: "", type: "ideal", fit: undefined },
                        ])
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Hypothetical Profile
                    </Button>
                  </TabsContent>
                </ScrollArea>

                {/* Fixed footer for each tab */}
                <div className="absolute bottom-0 right-0 left-0 py-4 px-4 bg-background border-t">
                  {activeTab === "description" && (
                    <div className="flex justify-end">
                      <Button onClick={handleDescriptionSubmit} disabled={isDescriptionSubmitting}>
                        {isDescriptionSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Description"
                        )}
                      </Button>
                    </div>
                  )}

                  {activeTab === "traits" && (
                    <div className="flex justify-end">
                      <Button onClick={handleTraitsSubmit} disabled={isTraitsSubmitting}>
                        {isTraitsSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Traits"
                        )}
                      </Button>
                    </div>
                  )}

                  {activeTab === "profiles" && (
                    <div className="flex justify-end">
                      <Button onClick={handleProfilesSubmit} disabled={isProfilesSubmitting}>
                        {isProfilesSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Profiles"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 