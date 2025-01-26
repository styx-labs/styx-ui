import React, { useState, useMemo } from "react";
import type { Candidate } from "@/types/index";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CandidateRow } from "./CandidateRow";
import { CandidateSidebar } from "../sidebar/CandidateSidebar";
import { useCandidateActions } from "../../hooks/useCandidateActions";

interface CandidateListProps {
  candidates: Candidate[];
  onGetEmail?: (url: string) => Promise<string | undefined>;
  onReachout?: (id: string, format: string) => Promise<string | undefined>;
  onDelete?: (id: string) => Promise<void>;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onGetEmail,
  onReachout,
  onDelete,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { loadingStates, handleEmail, handleReachout, handleDelete } =
    useCandidateActions({
      onGetEmail,
      onReachout,
      onDelete,
    });

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidates;

    const query = searchQuery.toLowerCase();
    return candidates.filter((candidate) => {
      const name = candidate.name?.toLowerCase() || "";
      const occupation = candidate.profile?.occupation?.toLowerCase() || "";
      const company =
        candidate.profile?.experiences?.[0]?.company?.toLowerCase() || "";

      return (
        name.includes(query) ||
        occupation.includes(query) ||
        company.includes(query)
      );
    });
  }, [candidates, searchQuery]);

  const currentIndex = selectedCandidate
    ? filteredCandidates.findIndex((c) => c.id === selectedCandidate.id)
    : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedCandidate(filteredCandidates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredCandidates.length - 1) {
      setSelectedCandidate(filteredCandidates[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredCandidates.length} candidate
          {filteredCandidates.length !== 1 ? "s" : ""} found
        </div>
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[200px]">Current Position</TableHead>
              <TableHead className="text-center">
                AI Evaluation (Beta)
              </TableHead>
              <TableHead className="text-center">Required Traits</TableHead>
              <TableHead>Preferred Traits</TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                loadingStates={loadingStates}
                onSelect={setSelectedCandidate}
                onLinkedIn={(url) => window.open(url, "_blank")}
                onEmail={handleEmail}
                onReachout={handleReachout}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <CandidateSidebar
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={currentIndex > 0}
        hasNext={currentIndex < filteredCandidates.length - 1}
        loadingStates={loadingStates}
        onGetEmail={handleEmail}
        onReachout={handleReachout}
        onDelete={handleDelete}
      />
    </div>
  );
};
