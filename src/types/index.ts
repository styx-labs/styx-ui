export interface Job {
  id?: string;
  job_description: string;
  key_traits: string[];
}

export interface Candidate {
  id?: string;
  name?: string;
  context?: string;
  url?: string;
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