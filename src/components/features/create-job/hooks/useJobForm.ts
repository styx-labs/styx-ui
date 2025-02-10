import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/api";
import { TraitType } from "@/types/index";
import type { CalibratedProfile } from "@/types/index";
import type { JobFormState, KeyTrait } from "../types";

interface UseJobFormProps {
  onSubmit: (
    description: string,
    keyTraits: KeyTrait[],
    jobTitle: string,
    companyName: string,
    calibratedProfiles: CalibratedProfile[]
  ) => void;
}

export const useJobForm = ({ onSubmit }: UseJobFormProps) => {
  const { toast } = useToast();
  const [state, setState] = useState<JobFormState>({
    description: "",
    jobTitle: "",
    companyName: "",
    suggestedTraits: [],
    calibratedProfiles: [],
    currentStep: 1,
  });

  const updateState = (updates: Partial<JobFormState>) => {
    setState((prev: JobFormState) => ({ ...prev, ...updates }));
  };

  const handleDescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState({ currentStep: 2 });
  };

  const handleCalibrateProfilesSubmit = async (
    calibratedProfiles: CalibratedProfile[]
  ) => {
    try {
      const response = await apiService.getKeyTraits(
        state.description,
        calibratedProfiles
      );
      const formattedTraits = Array.isArray(response.data.key_traits)
        ? response.data.key_traits.map(
            (
              trait:
                | string
                | {
                    trait: string;
                    description: string;
                    trait_type?: TraitType;
                    value_type?: string;
                    required?: boolean;
                  }
            ) => {
              if (typeof trait === "string") {
                return {
                  trait,
                  description: "",
                  trait_type: TraitType.SCORE,
                  required: false,
                };
              }
              return {
                ...trait,
                trait_type: trait.trait_type || TraitType.SCORE,
                required: trait.required ?? false,
              };
            }
          )
        : response.data.key_traits;

      updateState({
        suggestedTraits: formattedTraits,
        jobTitle: response.data.job_title,
        companyName: response.data.company_name,
        calibratedProfiles: response.data.calibrated_profiles,
        currentStep: 3,
      });
    } catch (error) {
      toast({
        title: "Failed to get key traits",
        variant: "destructive",
      });
      console.error("Error getting key traits:", error);
    }
  };

  const handleTraitsConfirm = async (
    traits: KeyTrait[],
    title: string,
    company: string
  ): Promise<void> => {
    return onSubmit(
      state.description,
      traits,
      title,
      company,
      state.calibratedProfiles
    );
  };

  const goToPreviousStep = () => {
    updateState({ currentStep: state.currentStep - 1 });
  };

  return {
    state,
    actions: {
      setDescription: (value: string) => updateState({ description: value }),
      handleDescriptionSubmit,
      handleCalibrateProfilesSubmit,
      handleTraitsConfirm,
      goToPreviousStep,
    },
  };
};
