import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Job } from './types';
import { useJobs } from './hooks/useJobs';
import { useCandidates } from './hooks/useCandidates';
import { JobSection } from './components/JobSection';
import { CandidateSection } from './components/CandidateSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConnectionError } from './components/ConnectionError';
import { JobForm } from './components/JobForm';

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState<boolean>(false);
  const { jobs, isLoading, createJob, deleteJob, error, retry } = useJobs();
  const { candidates, createCandidate, deleteCandidate } = useCandidates(selectedJob?.id);

  const handleDeleteJob = async (jobId: string) => {
    const success = await deleteJob(jobId);
    if (success && selectedJob?.id === jobId) {
      setSelectedJob(null);
    }
  };

  const handleCreateJob = async (description: string, keyTraits: string[]) => {
    const success = await createJob(description, keyTraits);
    if (success) {
      setIsCreatingJob(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <ConnectionError onRetry={retry} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex fixed inset-0">
        <Toaster position="top-right" />
        
        {/* Sidebar - Fixed */}
        <div className="w-1/4 min-w-[300px] border-r border-gray-200 bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <JobSection
              jobs={jobs}
              isLoading={isLoading}
              onJobSelect={(job) => {
                setSelectedJob(job);
                setIsCreatingJob(false);
              }}
              onCreateClick={() => {
                setIsCreatingJob(true);
                setSelectedJob(null);
              }}
              onJobDelete={handleDeleteJob}
              selectedJobId={selectedJob?.id}
            />
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {isCreatingJob ? (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Job</h2>
                <JobForm onSubmit={handleCreateJob} />
              </div>
            ) : selectedJob ? (
              <CandidateSection
                job={selectedJob}
                candidates={candidates}
                onCandidateCreate={createCandidate}
                onCandidateDelete={deleteCandidate}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a job or create a new one to get started
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;