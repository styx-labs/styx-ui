import React from "react";

interface CandidateSectionNavProps {
  candidateId: string;
  hasSummary: boolean;
  hasSections: boolean;
  hasCitations: boolean;
  hasProfile: boolean;
  search_mode?: boolean;
  selectedSection: string;
  onSectionChange: (candidateId: string, section: string) => void;
}

export const CandidateSectionNav: React.FC<CandidateSectionNavProps> = ({
  candidateId,
  hasSummary,
  hasSections,
  hasCitations,
  hasProfile,
  search_mode = true,
  selectedSection,
  onSectionChange,
}) => {
  return (
    <div className="flex gap-3 mb-4">
      {hasSummary && (
        <button
          onClick={() => onSectionChange(candidateId, "summary")}
          className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
            selectedSection === "summary"
              ? "bg-purple-600 text-white"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Summary
        </button>
      )}
      {hasProfile && (
        <button
          onClick={() => onSectionChange(candidateId, "profile")}
          className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
            selectedSection === "profile"
              ? "bg-purple-600 text-white"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Profile
        </button>
      )}
      {hasSections && (
        <button
          onClick={() => onSectionChange(candidateId, "breakdown")}
          className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
            selectedSection === "breakdown"
              ? "bg-purple-600 text-white"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Breakdown
        </button>
      )}
      {hasCitations && search_mode && (
        <button
          onClick={() => onSectionChange(candidateId, "citations")}
          className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
            selectedSection === "citations"
              ? "bg-purple-600 text-white"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Citations
        </button>
      )}
    </div>
  );
};
