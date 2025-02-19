import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Job, TraitType, CalibratedProfile } from "@/types/index";
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
  const { toast } = useToast();
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
      toast({
        title: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getKeyTraits = async (
    description: string,
    calibratedProfiles: CalibratedProfile[]
  ) => {
    try {
      const response = await apiService.getKeyTraits(
        description,
        calibratedProfiles
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
    calibratedProfiles: CalibratedProfile[]
  ) => {
    try {
      const jobResponse = await apiService.createJob({
        job_description: description,
        key_traits: keyTraits,
        job_title: jobTitle,
        company_name: companyName,
        calibrated_profiles: calibratedProfiles,
      });

      if (jobResponse.data.job_id) {
        toast({
          title: "Job created successfully",
        });
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
        toast({
          title: "Job deleted successfully",
        });
        await loadJobs();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Failed to delete job",
        variant: "destructive",
      });
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
  };
}
