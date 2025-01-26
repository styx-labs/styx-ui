import React, { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Upload,
  UserPlus,
  RefreshCw,
  Search,
  Edit2,
} from "lucide-react";
import { Candidate, Job } from "../../../types";
import { CandidateList } from "./CandidateList";
import { CandidateForm } from "./CandidateForm";
import { toast } from "react-hot-toast";
import Papa from "papaparse";
import { EditKeyTraits } from "./components/EditKeyTraits";
import { CandidateTraitFilter } from "./components/CandidateTraitFilter";

interface CandidateSectionProps {
  job: Job;
  candidates: Candidate[];
  isLoading?: boolean;
  onCandidateCreate: (
    name?: string,
    context?: string,
    url?: string,
    searchMode?: boolean
  ) => Promise<void>;
  onCandidateDelete: (candidateId: string) => void;
  onCandidatesBatch: (urls: string[], searchMode?: boolean) => Promise<void>;
  onCandidateReachout: (
    candidateId: string,
    format: string
  ) => Promise<string | undefined>;
  onGetEmail: (linkedinUrl: string) => Promise<string | undefined>;
  onRefresh: () => void;
  onTraitFilterChange: (traits: string[]) => void;
}

export const CandidateSection: React.FC<CandidateSectionProps> = ({
  job,
  candidates,
  isLoading = false,
  onCandidateCreate,
  onCandidateDelete,
  onCandidatesBatch,
  onCandidateReachout,
  onGetEmail,
  onRefresh,
  onTraitFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [searchMode, setSearchMode] = useState(true);
  const [showEditTraits, setShowEditTraits] = useState(false);
  const [expandedTraitIndex, setExpandedTraitIndex] = useState<number | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState<"processing" | "complete">(
    "complete"
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
                    Show Less <ChevronUp className="ml-1 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="ml-1 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
          {job.key_traits && job.key_traits.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Key Traits
                </h3>
                <button
                  onClick={() => setShowEditTraits(true)}
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit Traits and Re-Evaluate
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {job.key_traits.map((trait, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center px-3 py-1 bg-white rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                        expandedTraitIndex === index
                          ? "ring-1 ring-purple-500 bg-purple-50"
                          : ""
                      }`}
                      onClick={() =>
                        setExpandedTraitIndex(
                          expandedTraitIndex === index ? null : index
                        )
                      }
                    >
                      <span className="text-xs font-medium text-purple-800">
                        {trait.trait}
                      </span>
                    </div>
                  ))}
                </div>
                {expandedTraitIndex !== null &&
                  job.key_traits[expandedTraitIndex]?.description && (
                    <div className="bg-white rounded-lg p-3 mt-2 text-xs text-gray-600">
                      {job.key_traits[expandedTraitIndex].description}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidates Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <CandidateTraitFilter
              job={job}
              onFilterChange={onTraitFilterChange}
            />
            <button
              type="button"
              onClick={() => setSearchMode(!searchMode)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                searchMode
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Search size={14} className="mr-1.5" />
              Search Mode {searchMode ? "On" : "Off"}
              <span className="ml-2 text-xs text-gray-500">
                {searchMode ? "(Slower, More Info)" : "(Faster, Basic Info)"}
              </span>
            </button>
            <div className="flex items-center gap-2">
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
                        // Parse CSV file
                        const results = await new Promise<string[]>(
                          (resolve, reject) => {
                            Papa.parse(file, {
                              header: true,
                              skipEmptyLines: true,
                              complete: (results) => {
                                // Check if 'url' column exists
                                if (!results.meta.fields?.includes("url")) {
                                  reject(
                                    new Error(
                                      "The CSV file must have a column labeled 'url' containing LinkedIn URLs"
                                    )
                                  );
                                  return;
                                }

                                const urls = results.data
                                  .map((row: any) => row.url)
                                  .filter(
                                    (url: string | undefined): url is string =>
                                      typeof url === "string" &&
                                      url.trim() !== ""
                                  );
                                resolve(urls);
                              },
                              error: (error) => {
                                reject(error);
                              },
                            });
                          }
                        );

                        if (results.length === 0) {
                          throw new Error(
                            "No valid LinkedIn URLs found in the 'url' column"
                          );
                        }

                        await onCandidatesBatch(results, searchMode);
                        toast.success(
                          `Found ${results.length} LinkedIn URLs to process`
                        );
                      } catch (error) {
                        console.error("Error processing CSV:", error);
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "Failed to process CSV file"
                        );
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
            </div>
            <button
              onClick={() => setShowCandidateForm(!showCandidateForm)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              <UserPlus size={16} className="mr-2" />
              Add Candidate
            </button>
            <button
              onClick={onRefresh}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
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

        {showCandidateForm && (
          <CandidateForm
            onSubmit={(name, context, url) =>
              onCandidateCreate(name, context, url, searchMode)
            }
          />
        )}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CandidateList
            candidates={candidates}
            onDeleteCandidate={onCandidateDelete}
            onReachout={onCandidateReachout}
            onGetEmail={onGetEmail}
          />
        )}
      </div>

      {showEditTraits && (
        <EditKeyTraits
          job={job}
          onClose={() => setShowEditTraits(false)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};
