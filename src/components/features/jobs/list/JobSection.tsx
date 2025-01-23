import React, { useState } from "react";
import { Job } from "../../../../types";
import { JobList } from "./JobList";
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
  onOpenPricing: () => void;
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
  onOpenPricing,
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
      {/* Header and Job List Container */}
      <div className="flex-1 min-h-0 flex flex-col">
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onCreateClick={onCreateClick}
          onSearch={setSearchQuery}
        />

        {/* Job list with its own scrollable container */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto">
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

      {/* Profile Menu - Sticky at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200">
        <ProfileMenu
          user={user}
          onLogout={onLogout}
          renderAvatar={renderAvatar}
          isCollapsed={isCollapsed}
          onOpenPricing={onOpenPricing}
        />
      </div>
    </div>
  );
};
