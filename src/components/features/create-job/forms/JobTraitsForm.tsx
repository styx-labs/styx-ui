import { useState } from "react";
import {
  Plus,
  ArrowLeft,
  Building2,
  ListChecks,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Users,
} from "lucide-react";
import { TraitType, CalibratedProfile } from "@/types/index";
import { TraitCard } from "../components/TraitCard";
import { JobDetailsForm } from "./JobDetailsForm";
import { TraitTips } from "../components/TraitTips";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface KeyTrait {
  trait: string;
  description: string;
  trait_type: TraitType;
  value_type?: string;
  required: boolean;
}

interface JobTraitsFormProps {
  suggestedTraits: KeyTrait[];
  jobTitle: string;
  companyName: string;
  calibratedProfiles: CalibratedProfile[];
  onConfirm: (
    traits: KeyTrait[],
    jobTitle: string,
    companyName: string
  ) => void;
  onBack: () => void;
}

export const JobTraitsForm: React.FC<JobTraitsFormProps> = ({
  suggestedTraits,
  jobTitle: initialJobTitle,
  companyName: initialCompanyName,
  calibratedProfiles,
  onConfirm,
  onBack,
}) => {
  const [traits, setTraits] = useState<KeyTrait[]>(suggestedTraits);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTrait = () => {
    setTraits([
      ...traits,
      {
        trait: "",
        description: "",
        trait_type: TraitType.SCORE,
        required: false,
        value_type: "",
      },
    ]);
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const updateTrait = (index: number, updates: Partial<KeyTrait>) => {
    const newTraits = [...traits];
    newTraits[index] = { ...newTraits[index], ...updates };
    setTraits(newTraits);
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm(traits, jobTitle, companyName);
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Review Job Details & Key Traits
        </h1>
        <p className="text-muted-foreground">
          We've analyzed your job description. Please review and customize the
          details below.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold flex items-center">
            <Building2 className="mr-2 h-6 w-6 text-purple-500" />
            Job Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Review and update the basic job information
          </p>
        </CardHeader>
        <CardContent>
          <JobDetailsForm
            jobTitle={jobTitle}
            companyName={companyName}
            onJobTitleChange={setJobTitle}
            onCompanyNameChange={setCompanyName}
          />
        </CardContent>
      </Card>

      {calibratedProfiles.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold flex items-center">
              <Users className="mr-2 h-6 w-6 text-purple-500" />
              Calibration Profiles
            </h2>
            <p className="text-sm text-muted-foreground">
              Reference profiles used to calibrate the evaluation system
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {calibratedProfiles.map((profile, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {profile.profile?.full_name}
                    </h3>
                    <Badge
                      variant={
                        profile.fit === "good" ? "default" : "destructive"
                      }
                      className="flex items-center gap-1"
                    >
                      {profile.fit === "good" ? (
                        <ThumbsUp className="h-3 w-3" />
                      ) : (
                        <ThumbsDown className="h-3 w-3" />
                      )}
                      {profile.fit === "good" ? "Good Fit" : "Not a Fit"}
                    </Badge>
                  </div>
                  {profile.profile?.occupation && (
                    <p className="text-sm text-muted-foreground">
                      {profile.profile.occupation}
                    </p>
                  )}
                  {profile.reasoning && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {profile.reasoning}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold flex items-center">
            <ListChecks className="mr-2 h-6 w-6 text-purple-500" />
            Key Traits
          </h2>
          <p className="text-sm text-muted-foreground">
            Customize the required traits for this position
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <Separator className="my-6" />

          <TraitTips />
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
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center"
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2" />
                Creating Job..
              </>
            ) : (
              <>
                Create Job <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
