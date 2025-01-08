import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Candidate } from "../types";
import { apiService } from "../api";
import { useAuth } from "../context/AuthContext";

const POLLING_INTERVAL = 2000;

export function useCandidates(jobId: string | undefined) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: authLoading } = useAuth();
  const pollingTimeoutRef = useRef<NodeJS.Timeout>();

  const loadCandidates = async () => {
    if (!jobId || !user) return;

    try {
      const response = await apiService.getCandidates(jobId);
      setCandidates(response.data.candidates);
      setError(null);
      
      // Check if there are any processing candidates
      const hasProcessingCandidates = response.data.candidates.some(
        (candidate: Candidate) => candidate.status === 'processing'
      );

      // Clear existing timeout
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }

      // Set up next poll if there are processing candidates
      if (hasProcessingCandidates) {
        pollingTimeoutRef.current = setTimeout(loadCandidates, POLLING_INTERVAL);
      }
    } catch (error) {
      console.error("Error loading candidates:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to load candidates")
      );
      toast.error("Failed to load candidates");
    }
  };

  const getCandidate = async (candidateId: string) => {
    if (!jobId) return;

    try {
      const response = await apiService.getCandidate(jobId, candidateId);
      return response.data.candidate;
    } catch (error) {
      toast.error('Failed to load candidate');
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

  const createCandidatesBatch = async (file: File) => {
    if (!jobId) return;

    try {
      await apiService.createCandidatesBatch(jobId, file);
      toast.success('Candidates added successfully');
      loadCandidates();
    } catch (error) {
      toast.error('Failed to add candidates');
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

    // Cleanup function to clear timeout when component unmounts or jobId changes
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [authLoading, user, jobId]);

  return {
    candidates,
    createCandidate,
    deleteCandidate,
    getCandidate,
    createCandidatesBatch,
    error,
    isLoading: authLoading,
  };
}
