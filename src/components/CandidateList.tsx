import React, { useState } from "react";
import {
  Mail,
  Trash2,
  Linkedin,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Candidate, TraitEvaluation, Citation, TraitType } from "../types";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { TraitValue } from "./TraitValue";

interface CandidateListProps {
  candidates: Candidate[];
  onDeleteCandidate: (candidateId: string) => void;
  onReachout: (
    candidateId: string,
    format: string
  ) => Promise<string | undefined>;
  onGetEmail: (linkedinUrl: string) => Promise<string | undefined>;
}

interface Section {
  section: string;
  content: string;
  trait_type?: "BOOLEAN" | "NUMERIC" | "SCORE" | "CATEGORICAL";
  score?: number;
  value?: string | number | boolean;
  value_type?: string;
  required?: boolean;
}

const transformSection = (section: Section): TraitEvaluation => {
  // Default to SCORE type if not specified
  const trait_type = (section.trait_type as TraitType) || "TraitType.SCORE";

  return {
    section: section.section,
    content: section.content,
    trait_type,
    value:
      trait_type === TraitType.SCORE
        ? section.score || 0
        : section.value || section.score || 0,
    normalized_score: section.score || 0,
    required: section.required || false,
    value_type: section.value_type,
  };
};

const getScoreBucket = (score: number) => {
  // Then check score buckets
  if (score >= 8)
    return { text: "Good fit", color: "bg-green-100 text-green-800" };
  if (score >= 6)
    return { text: "Likely a good fit", color: "bg-blue-100 text-blue-800" };
  if (score >= 4)
    return { text: "Likely a bad fit", color: "bg-yellow-100 text-yellow-800" };
  return { text: "Bad fit", color: "bg-red-100 text-red-800" };
};

const hasEnoughInformation = (citations?: Citation[]) => {
  return citations && citations.length > 4;
};

const OverallScore: React.FC<{ score: number; citations?: Citation[] }> = ({
  score,
  citations,
}) => {
  const bucket = getScoreBucket(score);
  const enoughInfo = hasEnoughInformation(citations);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-2 py-0.5 text-sm font-medium rounded ${bucket.color}`}
      >
        {bucket.text}
      </span>
      {!enoughInfo && score < 6 && (
        <span className="px-2 py-0.5 text-sm font-medium rounded bg-gray-100 text-gray-800">
          Not enough information
        </span>
      )}
    </div>
  );
};

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onDeleteCandidate,
  onReachout,
  onGetEmail,
}) => {
  const [selectedSections, setSelectedSections] = useState<
    Record<string, string>
  >({});
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string>>(
    {}
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const toggleSection = (candidateId: string, sectionName: string) => {
    setSelectedSections((prev) => ({
      ...prev,
      [candidateId]: prev[candidateId] === sectionName ? "" : sectionName,
    }));
    // Clear selected trait when changing sections
    if (sectionName !== "breakdown") {
      setSelectedTraits((prev) => ({
        ...prev,
        [candidateId]: "",
      }));
    }
  };

  const handleReachout = async (candidateId: string, format: string) => {
    const message = await onReachout(candidateId, format);
    if (message !== undefined) {
      await navigator.clipboard.writeText(message);
      toast.success("Reachout copied to clipboard");
    }
    setOpenDropdownId(null);
  };

  const handleGetEmail = async (linkedinUrl: string | undefined) => {
    if (linkedinUrl) {
      const email = await onGetEmail(linkedinUrl);
      if (email) {
        await navigator.clipboard.writeText(email);
        toast.success("Email copied to clipboard");
      }
    }
  };

  const handleSparklesClick = (e: React.MouseEvent, candidateId: string) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setOpenDropdownId(openDropdownId === candidateId ? null : candidateId);
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (a.status !== "complete" || b.status !== "complete") return 0;
    return (b.overall_score ?? 0) - (a.overall_score ?? 0);
  });

  return (
    <div className="space-y-4">
      {sortedCandidates.map((candidate) => (
        <div
          key={candidate.id}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {candidate.name}
                  {candidate.status === "processing" && (
                    <Loader2
                      size={16}
                      className="animate-spin text-purple-600"
                    />
                  )}
                </h2>
                {candidate.url && (
                  <a
                    href={candidate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#0A66C2] hover:bg-blue-50 rounded-md"
                    title="View LinkedIn Profile"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {candidate.url && (
                  <button
                    onClick={() => handleGetEmail(candidate.url)}
                    className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-md"
                  >
                    <Mail size={18} />
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={(e) => handleSparklesClick(e, candidate.id!)}
                    className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-md"
                  >
                    <Sparkles size={18} />
                  </button>

                  {openDropdownId === candidate.id &&
                    dropdownPosition &&
                    createPortal(
                      <div
                        className="absolute z-50 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                        }}
                      >
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm text-gray-500">
                            Choose Generated Message Format
                          </div>
                          <button
                            onClick={() =>
                              handleReachout(candidate.id!, "linkedin")
                            }
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                          >
                            <Linkedin size={16} /> LinkedIn
                          </button>
                          <button
                            onClick={() =>
                              handleReachout(candidate.id!, "email")
                            }
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                          >
                            <Mail size={16} /> Email
                          </button>
                        </div>
                      </div>,
                      document.body
                    )}
                </div>
                {candidate.overall_score !== undefined && (
                  <OverallScore
                    score={candidate.overall_score}
                    citations={candidate.citations}
                  />
                )}
              </div>
              <button
                onClick={() => onDeleteCandidate(candidate.id!)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Section Navigation */}
            <div className="flex gap-3 mb-4">
              {candidate.summary && (
                <button
                  onClick={() => toggleSection(candidate.id!, "summary")}
                  className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
                    selectedSections[candidate.id!] === "summary"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Summary
                </button>
              )}
              {candidate.sections && candidate.sections.length > 0 && (
                <button
                  onClick={() => toggleSection(candidate.id!, "breakdown")}
                  className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
                    selectedSections[candidate.id!] === "breakdown"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Breakdown
                </button>
              )}
              {candidate.citations && (
                <button
                  onClick={() => toggleSection(candidate.id!, "citations")}
                  className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
                    selectedSections[candidate.id!] === "citations"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Citations
                </button>
              )}
            </div>

            {/* Content Display */}
            <div className="mt-4">
              {/* Summary Content */}
              {selectedSections[candidate.id!] === "summary" &&
                candidate.summary && (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{candidate.summary}</ReactMarkdown>
                  </div>
                )}

              {/* Breakdown Content */}
              {selectedSections[candidate.id!] === "breakdown" &&
                candidate.sections && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {candidate.sections.map((section) => (
                        <div
                          key={section.section}
                          className={`bg-white rounded-lg shadow-sm border ${
                            transformSection(section).required
                              ? "border-purple-200"
                              : "border-gray-100"
                          } transition-all duration-200 hover:shadow-md`}
                        >
                          <div
                            className={`p-4 cursor-pointer ${
                              selectedTraits[candidate.id!] === section.section
                                ? "bg-purple-50"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedTraits((prev) => ({
                                ...prev,
                                [candidate.id!]:
                                  prev[candidate.id!] === section.section
                                    ? ""
                                    : section.section,
                              }))
                            }
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <TraitValue
                                  trait={transformSection(section)}
                                  citations={candidate.citations}
                                />
                              </div>
                              <div className="ml-2 text-gray-400">
                                {selectedTraits[candidate.id!] ===
                                section.section ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </div>
                            </div>
                            {selectedTraits[candidate.id!] ===
                              section.section && (
                              <div className="mt-4 prose prose-sm max-w-none prose-a:text-purple-600 prose-a:hover:underline border-t border-gray-100 pt-4">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Citations Content */}
              {selectedSections[candidate.id!] === "citations" &&
                candidate.citations && (
                  <div className="space-y-4">
                    {candidate.citations.map((citation, index) => {
                      const citationKey = `${candidate.id}-${index}`;
                      const isExpanded =
                        selectedTraits[citationKey] === "expanded";

                      return (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                                  {index + 1}
                                </span>
                                <a
                                  href={citation.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-800 hover:underline text-sm font-medium truncate"
                                >
                                  {citation.url}
                                </a>
                              </div>
                              <div
                                className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                  citation.confidence >= 0.8
                                    ? "bg-green-100 text-green-800"
                                    : citation.confidence >= 0.6
                                    ? "bg-blue-100 text-blue-800"
                                    : citation.confidence >= 0.4
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {Math.round(citation.confidence * 100)}%
                                confidence
                              </div>
                            </div>
                            <div
                              className="flex items-center gap-2 cursor-pointer select-none"
                              onClick={() =>
                                setSelectedTraits((prev) => ({
                                  ...prev,
                                  [citationKey]: isExpanded ? "" : "expanded",
                                }))
                              }
                            >
                              <div className="text-gray-400">
                                {isExpanded ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </div>
                              <span className="text-sm text-gray-600">
                                {isExpanded ? "Show less" : "Show more"}
                              </span>
                            </div>
                            {isExpanded && (
                              <p className="text-sm text-gray-600 whitespace-pre-wrap pt-2 border-t border-gray-100">
                                {citation.distilled_content}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
