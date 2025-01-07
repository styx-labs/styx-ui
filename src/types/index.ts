export interface Job {
  id?: string;
  job_description: string;
  key_traits: string[];
  job_title: string;
  company_name: string;
}

export interface Candidate {
  id?: string;
  name?: string;
  context?: string;
  status?: string;
  url?: string;
  summary?: string;
  overall_score?: number;
  sections?: {
    section: string;
    score: number;
    content: string;
  }[];
  citations?: {
    url: string;
    confidence: number;
    distilled_content: string;
    index: number;
  }[];
}