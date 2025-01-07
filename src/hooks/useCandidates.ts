import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Candidate } from "../types";
import { apiService } from "../api";
import { useAuth } from "../context/AuthContext";

export function useCandidates(jobId: string | undefined) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: authLoading } = useAuth();

  const loadCandidates = async () => {
    if (!jobId || !user) return;

    try {
      const response = await apiService.getCandidates(jobId);
      setCandidates(response.data.candidates);
      setError(null);
    } catch (error) {
      console.error("Error loading candidates:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to load candidates")
      );
      toast.error("Failed to load candidates");
    }
  };

  const createCandidate = async (
    name?: string,
    context?: string,
    url?: string
  ) => {
    if (!jobId || !user) return;

    try {
      await apiService.createCandidate(jobId, {
        name: name || "",
        context: context || "",
        url: url || "",
      });
      toast.success("Candidate added successfully");
      setError(null);
      loadCandidates();
    } catch (error) {
      console.error("Error creating candidate:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to add candidate")
      );
      toast.error("Failed to add candidate");
    }
  };

  const deleteCandidate = async (candidateId: string) => {
    if (!jobId || !user) return;

    try {
      await apiService.deleteCandidate(jobId, candidateId);
      toast.success("Candidate deleted successfully");
      setError(null);
      loadCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to delete candidate")
      );
      toast.error("Failed to delete candidate");
    }
  };

  useEffect(() => {
    // Only load candidates when auth is ready and we have a user
    if (!authLoading && user && jobId) {
      loadCandidates();
    }
  }, [authLoading, user, jobId]);

  return {
    candidates,
    createCandidate,
    deleteCandidate,
    error,
    isLoading: authLoading,
  };
}
