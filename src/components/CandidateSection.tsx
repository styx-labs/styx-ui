import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Candidate, Job } from '../types';
import { CandidateList } from './CandidateList';
import { CandidateForm } from './CandidateForm';

interface CandidateSectionProps {
  job: Job;
  candidates: Candidate[];
  onCandidateCreate: (name?: string, context?: string, url?: string) => Promise<void>;
  onCandidateDelete: (candidateId: string) => void;
}

export const CandidateSection: React.FC<CandidateSectionProps> = ({
  job,
  candidates,
  onCandidateCreate,
  onCandidateDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to format the job description
  const formatDescription = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ));
  };

  return (
    <div className="space-y-6">
      {/* Job Details Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <div className="relative">
              <p className={`mt-1 text-gray-900 whitespace-pre-line overflow-hidden ${
                !isExpanded ? 'line-clamp-5' : ''
              }`}>
                {formatDescription(job.job_description)}
              </p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                {isExpanded ? (
                  <>
                    Show Less <ChevronUp className="ml-1" size={16} />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="ml-1" size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
          {job.key_traits && job.key_traits.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Key Traits</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.key_traits.map((trait, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidates Section */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Users className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        </div>

        <CandidateForm onSubmit={onCandidateCreate} />
        <CandidateList
          candidates={candidates}
          onDeleteCandidate={onCandidateDelete}
        />
      </div>
    </div>
  );
};