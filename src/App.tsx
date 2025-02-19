import { Routes, Route } from "react-router-dom";
import { useJobs } from "./hooks/useJobs";
import { useAuth } from "./context/AuthContext";
import { Login } from "./components/auth/Login";
import { ConnectionError } from "./components/common/ConnectionError";
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout";
import { useAuthSetup } from "./hooks/useAuthSetup";
import { useNavigate } from "react-router-dom";
import { getRoutes } from "./routes";
import { CalibratedProfile, Job } from "./types/index";
import { Loader2 } from "lucide-react";
export default function App() {
  const navigate = useNavigate();
  const { jobs, isLoading, createJob, deleteJob, error, retry } = useJobs();
  const { user, loading, logout } = useAuth();

  useAuthSetup(user);

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
    calibratedProfiles: CalibratedProfile[]
  ) => {
    const jobId = await createJob(
      description,
      keyTraits,
      jobTitle,
      companyName,
      calibratedProfiles
    );
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
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

  const routes = getRoutes({ onCreateJob: handleCreateJob });

  return (
    <AuthenticatedLayout
      user={user}
      jobs={jobs}
      isLoading={isLoading}
      onJobDelete={handleDeleteJob}
      onLogout={logout}
    >
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </AuthenticatedLayout>
  );
}
