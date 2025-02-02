import { useState, useEffect, useRef } from "react";
import { Candidate } from "@/types/index";
import { apiService } from "../api";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
const POLLING_INTERVAL = 2000;

export function useCandidates(jobId: string | undefined) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [traitFilters, setTraitFilters] = useState<string[]>([]);
  const { user, loading: authLoading } = useAuth();
  const pollingTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Clear candidates when jobId changes
  useEffect(() => {
    setCandidates([]);
    setError(null);
    setIsLoading(true);
  }, [jobId]);

  const loadCandidates = async (isPollingUpdate = false) => {
    if (!jobId || !user) return;
    if (!isPollingUpdate) {
      setIsLoading(true);
    }
    setIsPolling(isPollingUpdate);

    try {
      const response = await apiService.getCandidates(jobId, traitFilters);
      setCandidates(response.data.candidates);
      setError(null);

      // Check if there are any processing candidates
      const hasProcessingCandidates = response.data.candidates.some(
        (candidate: Candidate) => candidate.status === "processing"
      );

      // Clear existing timeout
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }

      // Set up next poll if there are processing candidates
      if (hasProcessingCandidates) {
        pollingTimeoutRef.current = setTimeout(
          () => loadCandidates(true),
          POLLING_INTERVAL
        );
      }
    } catch (error) {
      console.error("Error loading candidates:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to load candidates")
      );
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive",
      });
    } finally {
      if (!isPollingUpdate) {
        setIsLoading(false);
      }
      setIsPolling(false);
    }
  };

  // Update candidates when trait filters change
  useEffect(() => {
    if (jobId && user) {
      loadCandidates(false);
    }
  }, [jobId, user, traitFilters]);

  const getCandidate = async (candidateId: string) => {
    if (!jobId) return;

    try {
      const response = await apiService.getCandidate(jobId, candidateId);
      return response.data.candidate;
    } catch (error) {
      console.error("Error getting candidate:", error);
      toast({
        title: "Error",
        description: "Failed to load candidate",
      });
    }
  };

  const createCandidate = async (
    name?: string,
    context?: string,
    url?: string,
    search_mode: boolean = true
  ) => {
    if (!jobId || !user) return;

    try {
      await apiService.createCandidate(jobId, {
        name: name || "",
        context: context || "",
        url: url || "",
        search_mode,
      });
      toast({
        title: "Success",
        description: "Candidate added successfully",
      });
      setError(null);
      loadCandidates();
    } catch (error) {
      console.error("Error creating candidate:", error);

      if (axios.isAxiosError(error) && error.response?.status === 402) {
        const errorMessage = "Out of search credits";
        setError(new Error(errorMessage));
        toast({
          title: "Error",
          description: errorMessage,
        });
        return;
      }

      setError(
        error instanceof Error ? error : new Error("Failed to add candidate")
      );
      toast({
        title: "Error",
        description: "Failed to add candidate",
      });
    }
  };

  const createCandidatesBatch = async (
    urls: string[],
    search_mode: boolean = true
  ) => {
    if (!jobId) return;

    try {
      await apiService.createCandidatesBatch(jobId, urls, search_mode);
      toast({
        title: "Success",
        description: "Candidates added successfully",
      });
      loadCandidates();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 402) {
        setError(new Error("Out of search credits"));
        toast({
          title: "Error",
          description: "Out of search credits",
        });
      } else {
        setError(
          error instanceof Error ? error : new Error("Failed to add candidates")
        );
        toast({
          title: "Error",
          description: "Failed to add candidates",
        });
      }
    }
  };

  const deleteCandidate = async (candidateId: string) => {
    if (!jobId || !user) return;

    try {
      await apiService.deleteCandidate(jobId, candidateId);
      setError(null);
      loadCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to delete candidate")
      );
    }
  };

  const getCandidateReachout = async (candidateId: string, format: string) => {
    if (!jobId || !user) return;

    try {
      const response = await apiService.getCandidateReachout(
        jobId,
        candidateId,
        format
      );
      return response.data.reachout;
    } catch (error) {
      console.error("Error getting candidate reachout:", error);
    }
  };

  const getEmail = async (linkedinUrl: string) => {
    if (!jobId || !user) return;

    try {
      const response = await apiService.getEmail(linkedinUrl);
      return response.data.email;
    } catch (error) {
      console.error("Error getting email:", error);
    }
  };

  useEffect(() => {
    // Only load candidates when auth is ready and we have a user
    if (!authLoading && user && jobId) {
      loadCandidates(false);
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
    getCandidateReachout,
    getEmail,
    loadCandidates: () => loadCandidates(false),
    error,
    isLoading: (isLoading && !isPolling) || authLoading,
    setTraitFilters,
  };
}
