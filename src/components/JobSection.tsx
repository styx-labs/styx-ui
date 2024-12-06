import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Job } from '../types';
import { JobList } from './JobList';

interface JobSectionProps {
  jobs: Job[];
  selectedJobId?: string;
  isLoading: boolean;
  onJobSelect: (job: Job) => void;
  onCreateClick: () => void;
  onJobDelete: (jobId: string) => void;
}

export const JobSection: React.FC<JobSectionProps> = ({
  jobs,
  selectedJobId,
  isLoading,
  onJobSelect,
  onCreateClick,
  onJobDelete
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 bg-white px-4 pt-4 pb-2 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Jobs</h2>
          </div>
          <button
            onClick={onCreateClick}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
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
            selectedJobId={selectedJobId}
            onJobSelect={onJobSelect}
            onDeleteJob={onJobDelete}
          />
        )}
      </div>
    </div>
  );
};