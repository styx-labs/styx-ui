import { useState, useEffect } from "react";
import { Candidate } from "../types";
import { apiService } from "../api";

interface JobWithId {
  id?: string;
}

export const useAllCandidates = (jobs: JobWithId[]) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllCandidates = async () => {
      setIsLoading(true);
      try {
        const allCandidates = await Promise.all(
          jobs
            .filter((job): job is JobWithId & { id: string } => !!job.id)
            .map(async (job) => {
              try {
                const response = await apiService.getCandidates(job.id);
                return response.data;
              } catch (error) {
                console.error(
                  `Error fetching candidates for job ${job.id}:`,
                  error
                );
                return [];
              }
            })
        );

        // Flatten the array of arrays and remove duplicates by id
        const uniqueCandidates = Array.from(
          new Map(
            allCandidates.flat().map((candidate) => [candidate.id, candidate])
          ).values()
        );

        setCandidates(uniqueCandidates);
        setError(null);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobs.length > 0) {
      fetchAllCandidates();
    } else {
      setCandidates([]);
      setIsLoading(false);
    }
  }, [jobs]);

  return { candidates, isLoading, error };
};
