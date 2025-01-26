import React, { useState } from "react";
import { Candidate } from "../../../types";
import toast from "react-hot-toast";
import { CandidateCard } from "./components/CandidateCard";

interface CandidateListProps {
  candidates: Candidate[];
  onDeleteCandidate: (candidateId: string) => void;
  onReachout: (
    candidateId: string,
    format: string
  ) => Promise<string | undefined>;
  onGetEmail: (linkedinUrl: string) => Promise<string | undefined>;
}

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

  const handleSectionChange = (candidateId: string, sectionName: string) => {
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

  const handleTraitToggle = (candidateId: string, traitSection: string) => {
    setSelectedTraits((prev) => ({
      ...prev,
      [candidateId]: prev[candidateId] === traitSection ? "" : traitSection,
    }));
  };

  console.log(candidates);

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          selectedSection={selectedSections[candidate.id!] || ""}
          selectedTraits={selectedTraits}
          openDropdownId={openDropdownId}
          dropdownPosition={dropdownPosition}
          onDelete={onDeleteCandidate}
          onGetEmail={handleGetEmail}
          onReachout={handleReachout}
          onSparklesClick={handleSparklesClick}
          onSectionChange={handleSectionChange}
          onTraitToggle={handleTraitToggle}
        />
      ))}
    </div>
  );
};
