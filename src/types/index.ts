export interface IdealProfile {
  url: string;
  fit?: "yes" | "no" | "interesting";
  reasoning?: string;
}

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
  ideal_profiles: IdealProfile[];
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
  company_linkedin_profile_url?: string;
  summarized_job_description: AILinkedinJobDescription | null;
  funding_stages_during_tenure?: string[];
}

export interface ProfileEducation {
  degree_name: string;
  field_of_study: string;
  school: string;
  starts_at: string | null;
  ends_at: string | null;
  university_tier?: "top_5" | "top_10" | "top_20" | "top_50" | "other" | null;
}

export interface ExperienceStageMetrics {
  company_name: string;
  funding_stage: string;
  company_tier: string;
  joined_at: string;
  left_at: string | null;
  duration_months: number;
}

export interface CareerMetrics {
  total_experience_months: number;
  average_tenure_months: number;
  current_tenure_months: number;
  tech_stacks?: string[];
  career_tags?: string[];
  experience_tags?: string[];
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
  career_metrics?: CareerMetrics;
}

export interface Candidate {
  id?: string;
  name?: string;
  context?: string;
  status?: "processing" | "complete";
  url?: string;
  summary?: string;
  sections?: TraitEvaluation[];
  citations?: Citation[];
  profile?: Profile;
  created_at?: string;
  search_mode?: boolean;
  required_met?: number;
  optional_met?: number;
  fit?: number;
  favorite?: boolean;
  is_loading_indicator?: boolean;
  evaluation?: {
    score: number;
    traits_met: number;
    total_traits: number;
    trait_scores: number[];
  };
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
