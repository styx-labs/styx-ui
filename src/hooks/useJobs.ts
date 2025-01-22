import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Job, TraitType } from "../types";
import { apiService } from "../api";
import { useAuth } from "../context/AuthContext";

interface KeyTrait {
  trait: string;
  description: string;
  trait_type: TraitType;
  value_type?: string;
  required: boolean;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: authLoading } = useAuth();

  const loadJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getJobs();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error loading jobs:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to load jobs")
      );
      toast.error(
        error instanceof Error ? error.message : "Failed to load jobs"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getKeyTraits = async (
    description: string,
    ideal_profile_urls: string[]
  ) => {
    try {
      const response = await apiService.getKeyTraits(
        description,
        ideal_profile_urls
      );
      return response.data.key_traits;
    } catch (error) {
      console.error("Error getting key traits:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to get key traits");
    }
  };

  const createJob = async (
    description: string,
    keyTraits: KeyTrait[],
    jobTitle: string,
    companyName: string,
    ideal_profile_urls: string[]
  ) => {
    try {
      const jobResponse = await apiService.createJob({
        job_description: description,
        key_traits: keyTraits,
        job_title: jobTitle,
        company_name: companyName,
        ideal_profiles: ideal_profile_urls,
      });

      if (jobResponse.data.job_id) {
        toast.success("Job created successfully");
        await loadJobs();
        return jobResponse.data.job_id;
      }
      return null;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error instanceof Error ? error : new Error("Failed to create job");
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const response = await apiService.deleteJob(jobId);
      if (response.data.success) {
        toast.success("Job deleted successfully");
        await loadJobs();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job"
      );
      return false;
    }
  };

  useEffect(() => {
    // Only load jobs when auth is ready and we have a user
    if (!authLoading && user) {
      loadJobs();
    }
  }, [authLoading, user]);

  return {
    jobs,
    isLoading: isLoading || authLoading, // Include auth loading in isLoading state
    error,
    getKeyTraits,
    createJob,
    deleteJob,
    retry: loadJobs,
    refreshJobs: loadJobs,
  };
}
