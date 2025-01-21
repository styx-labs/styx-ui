import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useJobs } from "./hooks/useJobs";
import { useCandidates } from "./hooks/useCandidates";
import { useAllCandidates } from "./hooks/useAllCandidates";
import { JobSection } from "./components/features/jobs/JobSection";
import { CandidateSection } from "./components/features/candidates/CandidateSection";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ConnectionError } from "./components/common/ConnectionError";
import { JobForm } from "./components/features/jobs/forms/JobForm";
import { useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Login } from "./components/auth/Login";
import { setAuthUser, apiService } from "./api";
import { UnauthorizedError } from "./api";
import { useEffect } from "react";
import { Welcome } from "./components/layout/Welcome";
import { HomeScreen } from "./components/layout/HomeScreen";
import { User } from "firebase/auth";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { Job } from "./types";

// Extend Window interface
interface ExtendedWindow extends Window {
  currentUser?: User | null;
}
declare const window: ExtendedWindow;

function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, isLoading: jobsLoading, error, retry } = useJobs();
  const {
    candidates,
    createCandidate,
    deleteCandidate,
    createCandidatesBatch,
    loadCandidates,
    error: candidatesError,
    isLoading: candidatesLoading,
  } = useCandidates(jobId);

  const selectedJob = jobs.find((job) => job.id === jobId);

  // Update meta tags when job changes
  useEffect(() => {
    if (selectedJob) {
      // Update document title
      document.title = `${selectedJob.job_title} at ${selectedJob.company_name} - Styx`;

      // Update meta description
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

    // Cleanup on unmount
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
    // Handle unauthorized access
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

  // Handle unauthorized access to candidates
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

  const handleCandidateReachout = async (
    candidateId: string,
    format: string
  ) => {
    try {
      const response = await apiService.getCandidateReachout(
        jobId!,
        candidateId,
        format
      );
      return response.data.reachout;
    } catch (error) {
      console.error("Error getting reachout:", error);
      toast.error("Failed to generate reachout message");
      return undefined;
    }
  };

  const handleGetEmail = async (linkedinUrl: string) => {
    try {
      const response = await apiService.getEmail(linkedinUrl);
      return response.data.email;
    } catch (error) {
      console.error("Error getting email:", error);
      toast.error("Failed to get email");
      return undefined;
    }
  };

  return selectedJob ? (
    <CandidateSection
      job={selectedJob}
      candidates={candidates}
      isLoading={candidatesLoading}
      onCandidateCreate={createCandidate}
      onCandidateDelete={deleteCandidate}
      onCandidatesBatch={createCandidatesBatch}
      onCandidateReachout={handleCandidateReachout}
      onGetEmail={handleGetEmail}
      onRefresh={loadCandidates}
    />
  ) : null;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    React.useState<boolean>(false);
  const { jobs, isLoading, createJob, deleteJob, error, retry } = useJobs();
  const { candidates: allCandidates } = useAllCandidates(jobs);
  const { user, loading, logout } = useAuth();
  const [imageError, setImageError] = React.useState(false);

  // Set auth token in API service and notify extension when user changes
  React.useEffect(() => {
    const handleAuthChange = async () => {
      if (user) {
        const token = await user.getIdToken();
        // Store user reference for token refresh
        window.currentUser = user;
        // Set token in API service
        setAuthUser(user).catch((error) => {
          console.error("Error setting auth token:", error);
        });
        // Notify extension
        document.dispatchEvent(
          new CustomEvent("styxAuthUpdate", {
            detail: { token },
          })
        );
      } else {
        delete window.currentUser;
        setAuthUser(null);
        // Notify extension of logout
        document.dispatchEvent(
          new CustomEvent("styxAuthUpdate", {
            detail: { token: null },
          })
        );
      }
    };

    handleAuthChange();
  }, [user]);

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
    keyTraits: Job["key_traits"],
    jobTitle: string,
    companyName: string,
    ideal_profile_urls: string[]  
  ) => {
    const success = await createJob(
      description,
      keyTraits,
      jobTitle,
      companyName,
      ideal_profile_urls
    );
    if (success) {
      navigate("/");
    }
  };

  const renderAvatar = () => {
    if (user?.photoURL && !imageError) {
      return (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium cursor-pointer hover:bg-blue-600 transition-colors">
        {user?.displayName?.[0]?.toUpperCase() ||
          user?.email?.[0]?.toUpperCase() ||
          "?"}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <ConnectionError onRetry={retry} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex bg-gray-100">
        <Toaster position="top-right" />

        {/* Sidebar - Fixed height, scrollable */}
        <div
          className={`${
            isSidebarCollapsed ? "w-12" : "w-1/5 min-w-[300px]"
          } bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-200 ease-in-out overflow-hidden`}
        >
          <div className="flex-1 overflow-y-auto">
            <JobSection
              jobs={jobs}
              isLoading={isLoading}
              onJobSelect={(job) => {
                navigate(`/jobs/${job.id}`);
                if (isSidebarCollapsed) {
                  setIsSidebarCollapsed(false);
                }
              }}
              onCreateClick={() => {
                navigate("/jobs/create");
                if (isSidebarCollapsed) {
                  setIsSidebarCollapsed(false);
                }
              }}
              onJobDelete={handleDeleteJob}
              selectedJobId={jobId}
              renderAvatar={renderAvatar}
              user={user}
              onLogout={logout}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() =>
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }
            />
          </div>
        </div>

        {/* Main Content - Fixed height, scrollable */}
        <div className="flex-1 h-screen overflow-y-auto">
          <div className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  jobs.length === 0 && !isLoading ? (
                    <Welcome
                      onCreateClick={() => {
                        navigate("/jobs/create");
                      }}
                    />
                  ) : !jobId ? (
                    <HomeScreen
                      jobs={jobs}
                      candidates={allCandidates || []}
                      onCreateJob={() => {
                        navigate("/jobs/create");
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Select a job or create a new one to get started
                    </div>
                  )
                }
              />
              <Route
                path="/jobs/create"
                element={<JobForm onSubmit={handleCreateJob} />}
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
