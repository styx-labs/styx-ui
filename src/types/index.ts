export interface Job {
  id?: string;
  job_description: string;
  key_traits: string[];
}

export interface Candidate {
  id?: string;
  name: string;
  context: string;    // Changed from resume to match backend
  result?: string;
}