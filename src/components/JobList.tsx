import React from "react";
import { Trash2 } from "lucide-react";
import { Job } from "../types";

interface JobListProps {
  jobs: Job[];
  selectedJobId?: string;
  onJobSelect: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  selectedJobId,
  onJobSelect,
  onDeleteJob,
}) => {
  return (
    <div className="divide-y divide-solid divide-gray-200 bg-white -mt-2">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => onJobSelect(job)}
          className={`group flex items-center justify-between p-4 cursor-pointer
            ${
              selectedJobId === job.id
                ? "bg-gray-100"
                : "bg-white hover:bg-gray-50"
            }`}
        >
          <div className="flex flex-col overflow-hidden">
            <p className="font-medium text-gray-900 truncate">
              {job.company_name}
            </p>
            <p className="text-sm text-gray-500 truncate">{job.job_title}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteJob(job.id!);
            }}
            className="p-2 text-gray-400 hover:text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
      {jobs.length === 0 && (
        <div className="p-4 text-gray-500 text-center">No jobs found</div>
      )}
    </div>
  );
};
