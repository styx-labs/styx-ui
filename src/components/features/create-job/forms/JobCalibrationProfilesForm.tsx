import { useState } from "react";
import {
  X,
  LinkIcon,
  ArrowLeft,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CalibratedProfile } from "@/types/index";

interface JobCalibrationProfilesFormProps {
  onSubmit: (calibratedProfiles: CalibratedProfile[]) => void;
  onBack: () => void;
}

export const JobCalibrationProfilesForm: React.FC<
  JobCalibrationProfilesFormProps
> = ({ onSubmit, onBack }) => {
  const [profiles, setProfiles] = useState<CalibratedProfile[]>([
    { url: "", fit: "good" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileChange = (
    index: number,
    field: keyof CalibratedProfile,
    value: string
  ) => {
    const newProfiles = [...profiles];
    newProfiles[index] = { ...newProfiles[index], [field]: value };
    setProfiles(newProfiles);
  };

  const addProfile = () => {
    if (profiles.length < 10) {
      setProfiles([...profiles, { url: "", fit: "good" }]);
    }
  };

  const removeProfile = (index: number) => {
    const newProfiles = profiles.filter((_, i) => i !== index);
    setProfiles(newProfiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validProfiles = profiles.filter(
      (profile) => profile.url.trim() !== ""
    );
    await onSubmit(validProfiles);
    setIsSubmitting(false);
  };

  // Check if there are any valid profiles (non-empty URLs)
  const hasValidProfiles = profiles.some(
    (profile) => profile.url.trim() !== ""
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Calibrate Candidate Profiles
        </h1>
        <p className="text-muted-foreground mt-2">
          Add profiles that represent different types of candidates to help
          calibrate our evaluation system.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold flex items-center">
            <LinkIcon className="mr-2 h-6 w-6 text-purple-500" />
            LinkedIn Profiles
          </h2>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {profiles.map((profile, index) => (
              <div key={index} className="space-y-4 pt-4 first:pt-0">
                {index > 0 && <div className="border-t -mt-4" />}
                <div className="flex gap-3 items-start group">
                  <div className="flex-1 space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <LinkIcon className="h-4 w-4" />
                      </div>
                      <Input
                        type="url"
                        value={profile.url}
                        onChange={(e) =>
                          handleProfileChange(index, "url", e.target.value)
                        }
                        placeholder="LinkedIn Profile URL"
                        className="pl-9"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={
                            profile.fit === "good" ? "default" : "outline"
                          }
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            handleProfileChange(index, "fit", "good")
                          }
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Good Fit
                        </Button>
                        <Button
                          type="button"
                          variant={
                            profile.fit === "bad" ? "default" : "outline"
                          }
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            handleProfileChange(index, "fit", "bad")
                          }
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Not a Fit
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Textarea
                          value={profile.reasoning || ""}
                          onChange={(e) =>
                            handleProfileChange(
                              index,
                              "reasoning",
                              e.target.value
                            )
                          }
                          placeholder={`Explain why this candidate is a ${profile.fit} fit...`}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </div>
                  {profiles.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProfile(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {profiles.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addProfile}
                className="w-full"
              >
                <span className="h-5 w-5 rounded-full border-2 border-current inline-flex items-center justify-center mr-2">
                  +
                </span>
                Add another profile
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  {hasValidProfiles ? (
                    <>
                      Next: Key Traits <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Skip this step <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
