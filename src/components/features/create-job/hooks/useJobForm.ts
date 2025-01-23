import { useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "@/api";
import { TraitType } from "@/types";
import { JobFormState, KeyTrait } from "../types";

interface UseJobFormProps {
  onSubmit: (
    description: string,
    keyTraits: KeyTrait[],
    jobTitle: string,
    companyName: string,
    ideal_profile_urls: string[]
  ) => void;
}

export const useJobForm = ({ onSubmit }: UseJobFormProps) => {
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
    if (state.description.trim().length < 50) {
      toast.error("Please provide a more detailed job description");
      return;
    }
    updateState({ currentStep: 2 });
  };

  const handleIdealProfilesSubmit = async (urls: string[]) => {
    try {
      const response = await apiService.getKeyTraits(state.description, urls);
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
                  trait_type: TraitType.BOOLEAN,
                  required: false,
                };
              }
              return {
                ...trait,
                trait_type: TraitType.BOOLEAN,
                required: trait.required ?? false,
              };
            }
          )
        : response.data.key_traits;

      updateState({
        suggestedTraits: formattedTraits,
        jobTitle: response.data.job_title,
        companyName: response.data.company_name,
        idealProfiles: urls,
        currentStep: 3,
      });
    } catch (error) {
      toast.error("Failed to get key traits");
      console.error("Error getting key traits:", error);
    }
  };

  const handleTraitsConfirm = (
    traits: KeyTrait[],
    title: string,
    company: string
  ) => {
    onSubmit(state.description, traits, title, company, state.idealProfiles);
  };

  const goToPreviousStep = () => {
    updateState({ currentStep: state.currentStep - 1 });
  };

  return {
    state,
    actions: {
      setDescription: (description: string) => updateState({ description }),
      handleDescriptionSubmit,
      handleIdealProfilesSubmit,
      handleTraitsConfirm,
      goToPreviousStep,
    },
  };
};
