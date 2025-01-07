import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Job, Candidate } from "../types";
import { User, getIdToken } from "firebase/auth";

interface ExtendedWindow extends Window {
  currentUser: User | null;
}

declare const window: ExtendedWindow;

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout and validation
  validateStatus: (status) => status >= 200 && status < 300,
});

// Function to set auth token in headers
export const setAuthUser = async (user: User | null) => {
  if (user) {
    const token = await getIdToken(user, true);
    // Store token in localStorage
    localStorage.setItem("styxAuthToken", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Clear token from localStorage when user is null
    localStorage.removeItem("styxAuthToken");
    delete api.defaults.headers.common["Authorization"];
  }
};

// Custom error class for unauthorized access
export class UnauthorizedError extends Error {
  constructor(message: string = "You don't have access to this resource") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    // Handle 401 (unauthorized) - token expired or invalid
    if (error.response?.status === 401 && originalRequest) {
      try {
        const user = window.currentUser;
        if (user) {
          const newToken = await getIdToken(user, true);
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        throw new UnauthorizedError("Session expired. Please log in again.");
      }
    }

    // Handle 403 (forbidden) - user doesn't have access
    if (error.response?.status === 403) {
      throw new UnauthorizedError("You don't have access to this resource");
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  // Jobs
  getJobs: () => api.get<{ jobs: Job[] }>("/jobs"),

  createJob: (job: Omit<Job, "id">) =>
    api.post<{ job_id: string }>("/jobs", job),

  deleteJob: (jobId: string) =>
    api.delete<{ success: boolean }>(`/jobs/${jobId}`),

  getKeyTraits: (description: string) =>
    api.post<{ key_traits: string[]; job_title: string; company_name: string }>(
      "/get-key-traits",
      { description }
    ),

  // Candidates
  getCandidates: (jobId: string) =>
    api.get<{ candidates: Candidate[] }>(`/jobs/${jobId}/candidates`),

  getCandidate: (jobId: string, candidateId: string) =>
    api.get<{ candidate: Candidate }>(`/jobs/${jobId}/candidates/${candidateId}`),
  
  createCandidate: (jobId: string, candidate: Omit<Candidate, 'id'>) =>
    api.post<{ candidate_id: string }>(`/jobs/${jobId}/candidates`, candidate),

  deleteCandidate: (jobId: string, candidateId: string) =>
    api.delete<{ success: boolean }>(`/jobs/${jobId}/candidates/${candidateId}`),
    
  createCandidatesBatch: (jobId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ success: boolean }>(
      `/jobs/${jobId}/candidates_batch`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
};
