import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "../../../hooks/useJobs";

export const JobRedirect: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, isLoading } = useJobs();

  useEffect(() => {
    if (!isLoading) {
      if (!jobId) {
        // No job ID provided, go to home with no selection
        navigate("/", { replace: true });
        return;
      }

      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        // Job found, navigate to home with this job selected
        navigate("/", { state: { selectedJobId: jobId }, replace: true });
      } else {
        // Job not found, navigate to home with no selection
        navigate("/", { replace: true });
      }
    }
  }, [jobId, jobs, isLoading, navigate]);

  return null;
};
