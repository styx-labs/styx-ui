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

  const createCandidatesBatch = async (urls: string[], searchMode = false) => {
    if (!jobId) return;

    // Add a single loading indicator for all URLs
    const loadingIndicator = {
      id: "loading-indicator",
      name: `${urls.length} candidate${urls.length !== 1 ? "s" : ""}`,
      status: "processing" as const,
      is_loading_indicator: true,
    };

    // Create processing placeholders for each URL
    const processingCandidates = urls.map((url, index) => ({
      id: `processing-${index}`,
      name: url.split("/").pop() || "Processing...",
      status: "processing" as const,
      url,
    }));

    // Update state with both loading indicator and processing placeholders
    setCandidates((prev) => {
      // Remove any existing loading indicators
      const withoutLoading = prev.filter((c) => !c.is_loading_indicator);
      return [loadingIndicator, ...processingCandidates, ...withoutLoading];
    });

    try {
      const response = await apiService.createCandidatesBatch(
        jobId,
        urls,
        searchMode
      );

      // Remove loading indicators and processing placeholders
      setCandidates((prev) =>
        prev.filter(
          (c) =>
            !c.is_loading_indicator && c.id?.startsWith("processing-") !== true
        )
      );

      // Load the updated candidates list
      loadCandidates();

      return response.data;
    } catch (error) {
      console.error("Error creating candidates batch:", error);
      // Remove loading indicators and processing placeholders
      setCandidates((prev) =>
        prev.filter(
          (c) =>
            !c.is_loading_indicator && c.id?.startsWith("processing-") !== true
        )
      );
      throw error;
    }
  };

  const deleteCandidate = async (candidateId: string) => {
    if (!jobId || !user) return;

    try {
      await apiService.deleteCandidate(jobId, candidateId);
      setError(null);
    } catch (error) {
      console.error("Error deleting candidate:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to delete candidate")
      );
      throw error;
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

  const toggleCandidateFavorite = async (
    candidateId: string
  ): Promise<boolean> => {
    if (!jobId) return false;

    try {
      const response = await apiService.toggleCandidateFavorite(
        jobId,
        candidateId
      );
      // Don't reload candidates, let the optimistic UI handle it
      return response;
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
      return false;
    }
  };

  const bulkDeleteCandidates = async (
    candidateIds: string[]
  ): Promise<void> => {
    if (!jobId) return;

    try {
      await apiService.bulkDeleteCandidates(jobId, candidateIds);
    } catch (error) {
      console.error("Error bulk deleting candidates:", error);
      throw error;
    }
  };

  const bulkFavoriteCandidates = async (
    candidateIds: string[],
    shouldFavorite: boolean
  ): Promise<void> => {
    if (!jobId) return;

    console.log("Hook: bulkFavoriteCandidates called:", {
      jobId,
      candidateIds,
      shouldFavorite,
    });

    try {
      await apiService.bulkFavoriteCandidates(
        jobId,
        candidateIds,
        shouldFavorite
      );
      console.log("Hook: bulkFavoriteCandidates completed successfully");
      // Don't reload candidates, let the optimistic UI handle it
    } catch (error) {
      console.error("Error bulk favoriting candidates:", error);
      throw error;
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
    toggleCandidateFavorite,
    bulkDeleteCandidates,
    bulkFavoriteCandidates,
  };
}
