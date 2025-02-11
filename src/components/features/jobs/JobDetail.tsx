import { useNavigate, useParams } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import { useCandidates } from "@/hooks/useCandidates";
import { UnauthorizedError } from "@/api";
import { useEffect } from "react";
import { TalentEvaluation } from "../candidates/TalentEvaluation";

export function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, isLoading: jobsLoading, error, retry } = useJobs();
  const {
    candidates,
    createCandidate,
    deleteCandidate,
    createCandidatesBatch,
    loadCandidates,
    setTraitFilters,
    error: candidatesError,
    isLoading: candidatesLoading,
    toggleCandidateFavorite,
    bulkDeleteCandidates,
    bulkFavoriteCandidates,
    getCandidateReachout,
    getEmail,
  } = useCandidates(jobId);

  const selectedJob = jobs.find((job) => job.id === jobId);

  // Update meta tags when job changes
  useEffect(() => {
    if (selectedJob) {
      document.title = `${selectedJob.job_title} at ${selectedJob.company_name} - Styx`;
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `${selectedJob.job_title} position at ${
            selectedJob.company_name
          }. ${selectedJob.job_description.slice(0, 150)}...`
        );
      }
    } else {
      document.title = "Styx - AI Recruiting Assistant";
    }

    return () => {
      document.title = "Styx - AI Recruiting Assistant";
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          "Styx - AI-powered recruiting assistant for hiring managers and recruiters."
        );
      }
    };
  }, [selectedJob]);

  if (error) {
    if (error instanceof UnauthorizedError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go back to jobs
          </button>
        </div>
      );
    }
    return <ConnectionError onRetry={retry} />;
  }

  if (!selectedJob && !jobsLoading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Job Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          This job doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Go back to jobs
        </button>
      </div>
    );
  }

  if (candidatesError instanceof UnauthorizedError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-4">{candidatesError.message}</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Go back to jobs
        </button>
      </div>
    );
  }

  return selectedJob ? (
    <TalentEvaluation
      job={selectedJob}
      candidates={candidates}
      isLoading={candidatesLoading}
      onCandidateCreate={createCandidate}
      onCandidateDelete={deleteCandidate}
      onCandidatesBatch={async (urls, searchMode) => {
        const result = await createCandidatesBatch(urls, searchMode);
        return result?.success ?? false;
      }}
      onCandidateReachout={getCandidateReachout}
      onGetEmail={getEmail}
      onRefresh={loadCandidates}
      onTraitFilterChange={setTraitFilters}
      onCandidateFavorite={toggleCandidateFavorite}
      onBulkDelete={bulkDeleteCandidates}
      onBulkFavorite={async (ids) => {
        await bulkFavoriteCandidates(ids, true);
      }}
    />
  ) : null;
}
