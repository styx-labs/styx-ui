import axios from 'axios';
import { FormInput, CandidateEvaluation } from '../types';

const API_URL = 'http://localhost:8000';

export async function evaluateCandidate(input: FormInput): Promise<CandidateEvaluation> {
  try {
    const { data } = await axios.post<CandidateEvaluation>(`${API_URL}/evaluate`, {
      job_description: input.jobDescription,
      candidate_info: input.candidateInfo
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to evaluate candidate');
    }
    throw error;
  }
}