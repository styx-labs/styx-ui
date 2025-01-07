import React from "react";
import { Plus } from "lucide-react";
import { Job } from "../types";
import { JobList } from "./JobList";
import styxLogo from "../assets/styx_name_logo.png";
import { useParams } from "react-router-dom";

interface JobSectionProps {
  jobs: Job[];
  isLoading: boolean;
  onJobSelect: (job: Job) => void;
  onCreateClick: () => void;
  onJobDelete: (jobId: string) => void;
}

export const JobSection: React.FC<JobSectionProps> = ({
  jobs,
  isLoading,
  onJobSelect,
  onCreateClick,
  onJobDelete,
}) => {
  const { jobId } = useParams();

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 bg-white px-4 pt-4 pb-2 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={styxLogo}
              alt="Styx"
              className="h-10 w-auto -ml-1 -mt-1"
            />
          </div>
          <button
            onClick={onCreateClick}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
            title="Create New Job"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="p-4">Loading jobs...</p>
        ) : (
          <JobList
            jobs={jobs}
            selectedJobId={jobId}
            onJobSelect={onJobSelect}
            onDeleteJob={onJobDelete}
          />
        )}
      </div>
    </div>
  );
};
