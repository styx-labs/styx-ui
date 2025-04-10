import { TraitType, CalibratedProfile } from "@/types/index";

export interface KeyTrait {
  trait: string;
  description: string;
  trait_type: TraitType;
  value_type?: string;
  required: boolean;
}

export interface JobFormState {
  description: string;
  jobTitle: string;
  companyName: string;
  suggestedTraits: KeyTrait[];
  calibratedProfiles: CalibratedProfile[];
  currentStep: number;
}

export interface JobFormActions {
  setDescription: (value: string) => void;
  setJobTitle: (value: string) => void;
  setCompanyName: (value: string) => void;
  setSuggestedTraits: (traits: KeyTrait[]) => void;
  setIdealProfiles: (urls: string[]) => void;
  setCurrentStep: (step: number) => void;
}

export const STEPS = [
  "Job Description",
  "Calibrate Profiles",
  "Key Traits",
] as const;
export type Step = (typeof STEPS)[number];
