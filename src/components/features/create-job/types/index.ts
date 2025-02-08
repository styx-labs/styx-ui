import { TraitType, IdealProfile } from "@/types/index";

interface TeamMember {
  role: string;
  name?: string;
  description?: string;
}

interface TeamContext {
  hiring_manager?: TeamMember;
  direct_report?: TeamMember;
  team_members?: TeamMember[];
}

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
  idealProfiles: IdealProfile[];
  teamContext?: TeamContext;
  currentStep: number;
}

export interface JobFormActions {
  setDescription: (value: string) => void;
  setJobTitle: (value: string) => void;
  setCompanyName: (value: string) => void;
  setSuggestedTraits: (traits: KeyTrait[]) => void;
  setIdealProfiles: (urls: string[]) => void;
  setTeamContext: (context: TeamContext) => void;
  setCurrentStep: (step: number) => void;
}

export const STEPS = [
  "Job Description",
  "Team Context",
  "Ideal Profiles",
  "Key Traits",
] as const;
export type Step = (typeof STEPS)[number];
