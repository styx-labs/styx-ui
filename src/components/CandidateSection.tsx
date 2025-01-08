import React, { useState, useRef } from "react";
import { Users, ChevronDown, ChevronUp, Upload, UserPlus } from "lucide-react";
import { Candidate, Job } from "../types";
import { CandidateList } from "./CandidateList";
import { CandidateForm } from "./CandidateForm";
import { apiService } from "../api";
import { toast } from "react-hot-toast";

interface CandidateSectionProps {
  job: Job;
  candidates: Candidate[];
  onCandidateCreate: (
    name?: string,
    context?: string,
    url?: string
  ) => Promise<void>;
  onCandidateDelete: (candidateId: string) => void;
  onCandidatesBatch: (file: File) => Promise<void>;
}

export const CandidateSection: React.FC<CandidateSectionProps> = ({
  job,
  candidates,
  onCandidateCreate,
  onCandidateDelete,
  onCandidatesBatch
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState<"processing" | "complete">(
    "complete"
  );

  const filteredCandidates = candidates.filter(
    (candidate) => candidate.status === statusFilter
  );

  // Function to format the job description
  const formatDescription = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="border-b border-gray-200 pb-4 mb-6">
          {job.job_title && job.company_name && (
            <div className="mt-2 flex items-center text-xl text-gray-700">
              <span className="font-medium">{job.job_title}</span>
              <span className="mx-2 text-gray-400">at</span>
              <span className="text-purple-600">{job.company_name}</span>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Description
            </h3>
            <div className="relative bg-gray-50 rounded-lg p-4">
              <p
                className={`text-gray-900 whitespace-pre-line overflow-hidden ${
                  !isExpanded ? "line-clamp-5" : ""
                }`}
              >
                {formatDescription(job.job_description)}
              </p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium"
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
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Key Traits
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid gap-3">
                  {job.key_traits.map((trait, index) => (
                    <div
                      key={index}
                      className="flex flex-col bg-white rounded-lg p-3 shadow-sm"
                    >
                      <span className="text-sm font-medium text-purple-800">
                        {trait.trait}
                      </span>
                      {trait.description && (
                        <span className="text-sm text-gray-600 mt-1">
                          {trait.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidates Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="text-purple-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIsUploading(true);
                    try {
                      await onCandidatesBatch(file);
                    } catch (error) {
                      console.error("Error uploading candidates:", error);
                      toast.error("Failed to upload candidates");
                    } finally {
                      setIsUploading(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isUploading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                <Upload size={16} className="mr-2" />
                {isUploading ? "Uploading..." : "Upload CSV"}
              </button>
            </div>
            <button
              onClick={() => setShowCandidateForm(!showCandidateForm)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              <UserPlus size={16} className="mr-2" />
              Add Candidate
            </button>
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setStatusFilter("complete")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  statusFilter === "complete"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter("processing")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  statusFilter === "processing"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Processing
              </button>
            </div>
          </div>
        </div>

        {showCandidateForm && <CandidateForm onSubmit={onCandidateCreate} />}
        <CandidateList
          candidates={filteredCandidates}
          onDeleteCandidate={onCandidateDelete}
        />
      </div>
    </div>
  );
};
