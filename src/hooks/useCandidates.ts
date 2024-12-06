import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Candidate } from '../types';
import { apiService } from '../api';  // Fixed import from api to apiService

export function useCandidates(jobId: string | undefined) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const loadCandidates = async () => {
    if (!jobId) return;
    
    try {
      const response = await apiService.getCandidates(jobId);
      setCandidates(response.data.candidates);
    } catch (error) {
      toast.error('Failed to load candidates');
    }
  };

  const createCandidate = async (name: string, context: string) => {  // Changed from resume to context
    if (!jobId) return;

    try {
      await apiService.createCandidate(jobId, { name, context });  // Changed from resume to context
      toast.success('Candidate added successfully');
      loadCandidates();
    } catch (error) {
      toast.error('Failed to add candidate');
    }
  };

  const deleteCandidate = async (candidateId: string) => {
    if (!jobId) return;

    try {
      await apiService.deleteCandidate(jobId, candidateId);
      toast.success('Candidate deleted successfully');
      loadCandidates();
    } catch (error) {
      toast.error('Failed to delete candidate');
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [jobId]);

  return {
    candidates,
    createCandidate,
    deleteCandidate
  };
}