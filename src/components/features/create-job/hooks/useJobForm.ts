import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/api";
import { TraitType } from "@/types/index";
import type { IdealProfile } from "@/types/index";
import type { JobFormState, KeyTrait } from "../types";

interface UseJobFormProps {
  onSubmit: (
    description: string,
    keyTraits: KeyTrait[],
    jobTitle: string,
    companyName: string,
    ideal_profiles: IdealProfile[]
  ) => void;
}

export const useJobForm = ({ onSubmit }: UseJobFormProps) => {
  const { toast } = useToast();
  const [state, setState] = useState<JobFormState>({
    description: "",
    jobTitle: "",
    companyName: "",
    suggestedTraits: [],
    idealProfiles: [],
    currentStep: 1,
  });

  const updateState = (updates: Partial<JobFormState>) => {
    setState((prev: JobFormState) => ({ ...prev, ...updates }));
  };

  const handleDescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState({ currentStep: 2 });
  };

  const handleIdealProfilesSubmit = async (profiles: IdealProfile[]) => {
    try {
      const response = await apiService.getKeyTraits(
        state.description,
        profiles
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
        idealProfiles: profiles,
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
      state.idealProfiles
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
      handleIdealProfilesSubmit,
      handleTraitsConfirm,
      goToPreviousStep,
    },
  };
};
