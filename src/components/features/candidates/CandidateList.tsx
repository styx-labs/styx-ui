import React, { useState, useMemo } from "react";
import { Candidate } from "../../../types";
import toast from "react-hot-toast";
import { CandidateListControls } from "./components/CandidateListControls";
import { CandidateCard } from "./components/CandidateCard";
import { transformSection } from "./utils/transformSection";

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
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<
    Array<{ trait: string; minScore: number }>
  >([]);

  // Get all unique traits from candidates
  const allTraits = useMemo(() => {
    const traits = new Set<string>();
    candidates.forEach((candidate) => {
      candidate.sections?.forEach((section) => {
        traits.add(section.section);
      });
    });
    return Array.from(traits);
  }, [candidates]);

  // Handle sorting and filtering
  const processedCandidates = useMemo(() => {
    let result = [...candidates];

    // Apply all filters
    if (filters.length > 0) {
      result = result.filter((candidate) => {
        return filters.every((filter) => {
          const section = candidate.sections?.find(
            (s) => s.section === filter.trait
          );
          if (!section) return false;
          const traitEval = transformSection(section);
          return (traitEval.normalized_score || 0) >= filter.minScore;
        });
      });
    }

    // Then sort
    if (sortBy) {
      result.sort((a, b) => {
        const aSection = a.sections?.find((s) => s.section === sortBy);
        const bSection = b.sections?.find((s) => s.section === sortBy);
        const aScore = aSection
          ? transformSection(aSection).normalized_score
          : 0;
        const bScore = bSection
          ? transformSection(bSection).normalized_score
          : 0;
        return sortOrder === "desc" ? bScore - aScore : aScore - bScore;
      });
    } else {
      // Default sort by overall score
      result.sort((a, b) => {
        if (a.status !== "complete" || b.status !== "complete") return 0;
        return (b.overall_score ?? 0) - (a.overall_score ?? 0);
      });
    }

    return result;
  }, [candidates, sortBy, sortOrder, filters]);

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

  return (
    <div className="space-y-4">
      {/* <CandidateListControls
        allTraits={allTraits}
        filters={filters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        candidateCount={processedCandidates.length}
        onFilterChange={setFilters}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        }}
      /> */}

      {processedCandidates.map((candidate) => (
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
