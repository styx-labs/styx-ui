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

// Function to set cross-site cookie for extension
const setExtensionCookie = (token: string | null) => {
  const isDev = import.meta.env.DEV;
  const domainAttr = isDev ? "" : "domain=styxlabs.co;";
  const secureFlag = isDev ? "" : "Secure;";
  
  if (token) {
    document.cookie = `styxExtensionToken=${token}; path=/; ${domainAttr} max-age=3600; SameSite=None; ${secureFlag}`;
  } else {
    document.cookie = `styxExtensionToken=; path=/; ${domainAttr} max-age=0; SameSite=None; ${secureFlag}`;
  }
};

// Function to set auth token
export const setAuthUser = async (user: User | null) => {
  if (user) {
    const token = await getIdToken(user, true);

    // Set token in API headers
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Set cross-site cookie for extension
    setExtensionCookie(token);

    // Store refresh info
    window.currentUser = user;
  } else {
    // Clear everything on logout
    delete api.defaults.headers.common["Authorization"];
    setExtensionCookie(null);
    delete window.currentUser;
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
          // Update both API headers and extension cookie
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          setExtensionCookie(newToken);
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
    api.get<{ candidate: Candidate }>(
      `/jobs/${jobId}/candidates/${candidateId}`
    ),

  createCandidate: (jobId: string, candidate: Omit<Candidate, "id">) =>
    api.post<{ candidate_id: string }>(`/jobs/${jobId}/candidates`, candidate),

  deleteCandidate: (jobId: string, candidateId: string) =>
    api.delete<{ success: boolean }>(
      `/jobs/${jobId}/candidates/${candidateId}`
    ),

  createCandidatesBatch: (jobId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ success: boolean }>(
      `/jobs/${jobId}/candidates_batch`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  getCandidateReachout: (jobId: string, candidateId: string, format: string) => {
    return api.post<{ reachout: string }>(
      `/jobs/${jobId}/candidates/${candidateId}/generate-reachout`,
      {format}
    );
  },

  getEmail: (linkedin_profile_url: string) => {
    return api.post<{ email: string }>(
      "/get-email",
      { linkedin_profile_url }
    );
  },

  getSearchCredits: () => {
    return api.post<{ search_credits: number }>("/get-search-credits");
  },
};
