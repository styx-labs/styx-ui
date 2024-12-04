export interface FormInput {
  jobDescription: string;
  candidateInfo: string;
}

export interface SearchResult {
  url: string;
  summary: string;
  relevance: string;
}

export interface CandidateEvaluation {
  stop_reason: 'final_answer' | 'need_more_info';
  confidence_score: number;
  total_relevant_links: number;
  fullname: string;
  summary: string;
  relevant_links: string[];
  research_completeness: number;
  areas_needing_research: string[];
  collected_links: SearchResult[];
}