import React from "react";
import { Plus } from "lucide-react";
import { Job } from "../types";
import { JobList } from "./JobList";
import styxLogo from "../assets/styx_name_logo.png";
import { User } from "firebase/auth";

interface JobSectionProps {
  jobs: Job[];
  isLoading: boolean;
  onJobSelect: (job: Job) => void;
  onCreateClick: () => void;
  onJobDelete: (jobId: string) => Promise<void>;
  selectedJobId?: string;
  renderAvatar: () => React.ReactNode;
  user: User | null;
  onLogout: () => Promise<void>;
}

export const JobSection: React.FC<JobSectionProps> = ({
  jobs,
  isLoading,
  onJobSelect,
  onCreateClick,
  onJobDelete,
  selectedJobId,
  renderAvatar,
  user,
  onLogout,
}) => {
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
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateClick}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
              title="Create New Job"
            >
              <Plus size={24} />
            </button>
            <div className="relative group">
              {renderAvatar()}

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.displayName || user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="p-4">Loading jobs...</p>
        ) : (
          <JobList
            jobs={jobs}
            onJobSelect={onJobSelect}
            onDeleteJob={onJobDelete}
            selectedJobId={selectedJobId}
          />
        )}
      </div>
    </div>
  );
};
