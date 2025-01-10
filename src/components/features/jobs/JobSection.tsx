import React, { useState } from "react";
import { Job } from "../../../types";
import { JobList } from "./list/JobList";
import { User } from "firebase/auth";
import { SidebarHeader } from "./SidebarHeader";
import { ProfileMenu } from "./ProfileMenu";

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
  isCollapsed: boolean;
  onToggleCollapse: () => void;
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
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`h-full flex flex-col ${isCollapsed ? "overflow-hidden" : ""}`}
    >
      <div className="flex-1 flex flex-col">
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onCreateClick={onCreateClick}
          onSearch={setSearchQuery}
        />

        {/* Job list */}
        {!isCollapsed && (
          <div
            className={`flex-1 ${
              isCollapsed ? "overflow-hidden" : "overflow-y-auto"
            }`}
          >
            <JobList
              jobs={filteredJobs}
              onJobSelect={onJobSelect}
              onDeleteJob={onJobDelete}
              selectedJobId={selectedJobId}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      <ProfileMenu
        user={user}
        onLogout={onLogout}
        renderAvatar={renderAvatar}
        isCollapsed={isCollapsed}
      />
    </div>
  );
};
