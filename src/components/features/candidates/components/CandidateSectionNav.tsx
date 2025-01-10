import React from "react";

interface CandidateSectionNavProps {
  candidateId: string;
  hasSummary: boolean;
  hasSections: boolean;
  hasCitations: boolean;
  selectedSection: string;
  onSectionChange: (candidateId: string, section: string) => void;
}

export const CandidateSectionNav: React.FC<CandidateSectionNavProps> = ({
  candidateId,
  hasSummary,
  hasSections,
  hasCitations,
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
      {hasCitations && (
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
