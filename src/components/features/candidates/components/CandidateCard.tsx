import React from "react";
import { Candidate } from "../../../../types";
import { CandidateHeader } from "./CandidateHeader";
import { CandidateSectionNav } from "./CandidateSectionNav";
import { CandidateContent } from "./CandidateContent";

interface CandidateCardProps {
  candidate: Candidate;
  selectedSection: string;
  selectedTraits: Record<string, string>;
  openDropdownId: string | null;
  dropdownPosition: { top: number; left: number } | null;
  onDelete: (id: string) => void;
  onGetEmail: (url: string) => Promise<void>;
  onReachout: (id: string, format: string) => Promise<void>;
  onSparklesClick: (e: React.MouseEvent, id: string) => void;
  onSectionChange: (candidateId: string, section: string) => void;
  onTraitToggle: (candidateId: string, traitSection: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  selectedSection,
  selectedTraits,
  openDropdownId,
  dropdownPosition,
  onDelete,
  onGetEmail,
  onReachout,
  onSparklesClick,
  onSectionChange,
  onTraitToggle,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <CandidateHeader
          id={candidate.id!}
          name={candidate.name}
          status={candidate.status}
          url={candidate.url}
          overall_score={candidate.overall_score}
          citations={candidate.citations}
          openDropdownId={openDropdownId}
          dropdownPosition={dropdownPosition}
          onDelete={onDelete}
          onGetEmail={onGetEmail}
          onReachout={onReachout}
          onSparklesClick={onSparklesClick}
        />

        <CandidateSectionNav
          candidateId={candidate.id!}
          hasSummary={!!candidate.summary}
          hasSections={!!candidate.sections && candidate.sections.length > 0}
          hasCitations={!!candidate.citations}
          selectedSection={selectedSection}
          onSectionChange={onSectionChange}
        />

        <CandidateContent
          candidate={candidate}
          selectedSection={selectedSection}
          selectedTraits={selectedTraits}
          onTraitToggle={onTraitToggle}
        />
      </div>
    </div>
  );
};
