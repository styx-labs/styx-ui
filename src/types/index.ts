export interface Job {
  id?: string;
  job_description: string;
  key_traits: {
    trait: string;
    description: string;
    trait_type: TraitType;
    value_type?: string;
    required: boolean;
  }[];
  ideal_profiles: string[];
  job_title: string;
  company_name: string;
  created_at?: string;
}

interface AILinkedinJobDescription {
  role_summary: string;
  skills: string[];
  requirements: string[];
  sources: string[];
}

export interface ProfileExperience {
  company: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  location: string;
  summarized_job_description: AILinkedinJobDescription | null;
}

export interface ProfileEducation {
  degree_name: string;
  field_of_study: string;
  school: string;
  starts_at: string | null;
  ends_at: string | null;
}

export interface Profile {
  full_name: string;
  headline: string;
  occupation: string;
  public_identifier: string;
  summary: string | null;
  source_str: string;
  updated_at: string;
  url: string;
  experiences?: ProfileExperience[];
  education?: ProfileEducation[];
}

export interface Candidate {
  id?: string;
  name?: string;
  context?: string;
  status?: string;
  url?: string;
  summary?: string;
  overall_score?: number;
  sections?: TraitEvaluation[];
  citations?: Citation[];
  profile?: Profile;
  created_at?: string;
  search_mode?: boolean;
}

export interface Reachout {
  format: string;
}

export enum TraitType {
  BOOLEAN = "BOOLEAN",
  // NUMERIC = "NUMERIC",
  SCORE = "SCORE",
  // CATEGORICAL = "CATEGORICAL",
}

export interface TraitEvaluation {
  section: string; // Name of the trait
  content: string; // Textual evaluation with citations
  trait_type: TraitType; // "BOOLEAN" | "NUMERIC" | "SCORE" | "CATEGORICAL"
  value: boolean | number | string; // The actual value
  value_type?: string; // e.g., "years", "location", "tech_stack"
  normalized_score: number; // 0-10 score used for overall calculation
  required: boolean; // Whether this is a required trait
}

export interface Citation {
  index: number;
  url: string;
  confidence: number;
  distilled_content: string;
}

export interface CandidateEvaluation {
  sections: TraitEvaluation[];
  citations: Citation[];
  summary: string;
  overall_score: number;
}
