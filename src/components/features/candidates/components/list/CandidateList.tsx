import React, { useState, useMemo } from "react";
import type { Candidate } from "@/types/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateRow } from "./CandidateRow";
import { CandidateSidebar } from "../sidebar/CandidateSidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
interface CandidateListProps {
  candidates: Candidate[];
  onGetEmail?: (url: string) => Promise<string | undefined>;
  onReachout?: (id: string, format: string) => Promise<string | undefined>;
  onDelete?: (id: string) => Promise<void>;
  searchQuery: string;
  showSelection?: boolean;
  selectedCandidates?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

const ProcessingCandidateRow: React.FC<{
  candidate: Candidate;
}> = ({ candidate }) => (
  <TableRow className="cursor-default">
    <TableCell className="font-medium">
      <div className="flex items-center gap-2">
        <span>{candidate.name}</span>
      </div>
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[140px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
    </TableCell>
    <TableCell className="text-center">
      <Skeleton className="h-5 w-[100px] mx-auto" />
    </TableCell>
    <TableCell>
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-5 w-[120px]" />
        <Skeleton className="h-5 w-[100px]" />
      </div>
    </TableCell>
    <TableCell>
      <div className="flex gap-1">
        {[...Array(3)].map((_, j) => (
          <Skeleton key={j} className="h-6 w-[80px]" />
        ))}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        {[...Array(4)].map((_, j) => (
          <Skeleton key={j} className="h-8 w-8" />
        ))}
      </div>
    </TableCell>
  </TableRow>
);

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onGetEmail,
  onReachout,
  onDelete,
  searchQuery,
  showSelection = false,
  selectedCandidates = [],
  onSelectionChange,
}) => {
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { email: boolean; message: boolean };
  }>({});

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

  const handleEmail = async (url: string, candidateId: string) => {
    if (!onGetEmail) return;
    setLoadingStates((prev) => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], email: true },
    }));
    try {
      const email = await onGetEmail(url);
      if (email) {
        await navigator.clipboard.writeText(email);
        toast({
          title: "Success",
          description: `${email} copied to clipboard`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get email",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [candidateId]: { ...prev[candidateId], email: false },
      }));
    }
  };

  const handleReachout = async (candidateId: string, format: string) => {
    if (!onReachout) return;
    setLoadingStates((prev) => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], message: true },
    }));
    try {
      const message = await onReachout(candidateId, format);
      if (message !== undefined) {
        await navigator.clipboard.writeText(message);
        toast({
          title: "Message copied to clipboard",
          description: message,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate reachout",
        variant: "destructive",
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [candidateId]: { ...prev[candidateId], message: false },
      }));
    }
  };

  const handleDelete = async (e: React.MouseEvent, candidateId: string) => {
    e.stopPropagation();
    if (!onDelete) return;
    try {
      await onDelete(candidateId);
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(null);
      }
      toast({
        title: "Success",
        description: "Candidate deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete candidate",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredCandidates
        .filter((c) => c.status !== "processing" && c.id)
        .map((c) => c.id!);
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectCandidate = (candidateId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedCandidates, candidateId]);
    } else {
      onSelectionChange?.(
        selectedCandidates.filter((id) => id !== candidateId)
      );
    }
  };

  const selectableCandidatesCount = filteredCandidates.filter(
    (c) => c.status !== "processing"
  ).length;

  return (
    <>
      <div className="rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              {showSelection && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedCandidates.length === selectableCandidatesCount
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all candidates"
                  />
                </TableHead>
              )}
              <TableHead>Name</TableHead>
              <TableHead className="w-[200px]">Current Position</TableHead>
              <TableHead className="text-center">AI Evaluation</TableHead>
              <TableHead className="text-center">Traits Met</TableHead>
              <TableHead>Trait Breakdown</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) =>
              candidate.status === "processing" ? (
                <ProcessingCandidateRow
                  key={candidate.id}
                  candidate={candidate}
                />
              ) : (
                <CandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  loadingStates={loadingStates}
                  handleEmail={handleEmail}
                  handleReachout={handleReachout}
                  handleDelete={handleDelete}
                  setSelectedCandidate={setSelectedCandidate}
                  showSelection={showSelection}
                  isSelected={
                    candidate.id
                      ? selectedCandidates.includes(candidate.id)
                      : false
                  }
                  onSelectionChange={(checked: boolean) =>
                    candidate.id && handleSelectCandidate(candidate.id, checked)
                  }
                />
              )
            )}
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
        onGetEmail={async (url: string, id: string) => {
          await handleEmail(url, id);
        }}
        onReachout={async (id: string, format: string) => {
          await handleReachout(id, format);
        }}
        onDelete={handleDelete}
      />
    </>
  );
};
