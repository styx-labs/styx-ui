import axios, { AxiosError } from 'axios';
import { Job, Candidate } from '../types';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and validation
  validateStatus: (status) => status >= 200 && status < 300,
});

// Improved error handling
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    console.error('API Error:', {
      status: error.response.status,
      data: error.response.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

export const apiService = {
  // Jobs
  getJobs: () => api.get<{ jobs: Job[] }>('/jobs'),
  
  createJob: (job: Omit<Job, 'id'>) => 
    api.post<{ job_id: string }>('/jobs', job),
  
  deleteJob: (jobId: string) => 
    api.delete<{ success: boolean }>(`/jobs/${jobId}`),
  
  getKeyTraits: (description: string) => 
    api.post<{ key_traits: string[] }>('/get-key-traits', { description }),

  // Candidates
  getCandidates: (jobId: string) => 
    api.get<{ candidates: Candidate[] }>(`/jobs/${jobId}/candidates`),
  
  createCandidate: (jobId: string, candidate: Omit<Candidate, 'id'>) =>
    api.post<{ candidate_id: string }>(`/jobs/${jobId}/candidates`, candidate),
  
  deleteCandidate: (jobId: string, candidateId: string) =>
    api.delete<{ success: boolean }>(`/jobs/${jobId}/candidates/${candidateId}`)
};