import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useJobs } from "./hooks/useJobs";
import { useCandidates } from "./hooks/useCandidates";
import { JobSection } from "./components/JobSection";
import { CandidateSection } from "./components/CandidateSection";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ConnectionError } from "./components/ConnectionError";
import { JobForm } from "./components/JobForm";
import { useParams } from "react-router-dom";

function JobDetail() {
  const { jobId } = useParams();
  const { jobs, isLoading, error, retry } = useJobs();
  const { candidates, createCandidate, deleteCandidate } = useCandidates(jobId);
  console.log("jobId", jobId);

  const selectedJob = jobs.find((job) => job.id === jobId);

  if (error) {
    return <ConnectionError onRetry={retry} />;
  }

  if (!selectedJob && !isLoading) {
    return <div>Job not found</div>;
  }

  return selectedJob ? (
    <CandidateSection
      job={selectedJob}
      candidates={candidates}
      onCandidateCreate={createCandidate}
      onCandidateDelete={deleteCandidate}
    />
  ) : null;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreatingJob, setIsCreatingJob] = React.useState<boolean>(false);
  const { jobs, isLoading, createJob, deleteJob, error, retry } = useJobs();

  // Extract jobId from the current path
  const jobId = location.pathname.match(/\/jobs\/([^/]+)/)?.[1];

  const handleDeleteJob = async (jobId: string) => {
    const success = await deleteJob(jobId);
    if (success) {
      navigate("/");
    }
  };

  const handleCreateJob = async (
    description: string,
    keyTraits: string[],
    jobTitle: string,
    companyName: string
  ) => {
    const success = await createJob(
      description,
      keyTraits,
      jobTitle,
      companyName
    );
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
                navigate(`/jobs/${job.id}`);
                setIsCreatingJob(false);
              }}
              onCreateClick={() => {
                setIsCreatingJob(true);
                navigate("/");
              }}
              onJobDelete={handleDeleteJob}
              selectedJobId={jobId}
            />
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  isCreatingJob ? (
                    <div className="max-w-2xl mx-auto">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Create New Job
                      </h2>
                      <JobForm onSubmit={handleCreateJob} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Select a job or create a new one to get started
                    </div>
                  )
                }
              />
              <Route path="/jobs/:jobId" element={<JobDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
