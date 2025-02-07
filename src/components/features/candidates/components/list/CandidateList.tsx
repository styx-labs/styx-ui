import React, { useState, useMemo, useEffect } from "react";
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
import { BulkActions } from "./BulkActions";

interface CandidateListProps {
  candidates: Candidate[];
  onGetEmail?: (url: string) => Promise<string | undefined>;
  onReachout?: (id: string, format: string) => Promise<string | undefined>;
  onDelete?: (id: string) => Promise<void>;
  searchQuery: string;
  showSelection?: boolean;
  selectedCandidates?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onFavorite?: (id: string) => Promise<boolean>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkFavorite?: (ids: string[], favorite: boolean) => Promise<void>;
  onExportSelected?: (ids: string[]) => void;
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
  onFavorite,
  onBulkDelete,
  onBulkFavorite,
  onExportSelected,
}) => {
  const { toast } = useToast();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { email: boolean; message: boolean };
  }>({});

  // Get the selected candidate from candidates
  const selectedCandidate = useMemo(
    () =>
      selectedCandidateId
        ? candidates.find((c) => c.id === selectedCandidateId) || null
        : null,
    [selectedCandidateId, candidates]
  );

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

  const currentIndex = selectedCandidateId
    ? filteredCandidates.findIndex((c) => c.id === selectedCandidateId)
    : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedCandidateId(filteredCandidates[currentIndex - 1].id!);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredCandidates.length - 1) {
      setSelectedCandidateId(filteredCandidates[currentIndex + 1].id!);
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
      // Close sidebar if deleted candidate was selected
      if (selectedCandidateId === candidateId) {
        setSelectedCandidateId(null);
      }

      // Make the API call
      await onDelete(candidateId);
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

  const handleFavorite = async (candidateId: string) => {
    if (!onFavorite) return;
    try {
      // Make the API call
      await onFavorite(candidateId);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!onBulkDelete) return;
    try {
      // Close sidebar if deleted candidate was selected
      if (selectedCandidateId && ids.includes(selectedCandidateId)) {
        setSelectedCandidateId(null);
      }

      // Clear selection
      onSelectionChange?.([]);

      // Make the API call
      await onBulkDelete(ids);
      toast({
        title: "Success",
        description: `${ids.length} candidate${
          ids.length !== 1 ? "s" : ""
        } deleted successfully`,
      });
    } catch (error) {
      console.error("Error bulk deleting candidates:", error);
      toast({
        title: "Error",
        description: "Failed to delete candidates",
        variant: "destructive",
      });
    }
  };

  const handleBulkFavorite = async (ids: string[]) => {
    if (!onBulkFavorite) return;

    // Check if all selected candidates are already favorited
    const selectedCandidateObjects = candidates.filter(
      (c) => c.id && ids.includes(c.id)
    );
    const allFavorited =
      selectedCandidateObjects.length > 0 &&
      selectedCandidateObjects.every((c) => c.favorite);

    try {
      // Make the API call with the new favorite state
      await onBulkFavorite(ids, !allFavorited);
      toast({
        title: "Success",
        description: `${ids.length} candidate${ids.length !== 1 ? "s" : ""} ${
          allFavorited ? "unstarred" : "starred"
        } successfully`,
      });
    } catch (error) {
      console.error("Error bulk favoriting candidates:", error);
      toast({
        title: "Error",
        description: `Failed to ${allFavorited ? "unstar" : "star"} candidates`,
        variant: "destructive",
      });
    }
  };

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
                  handleFavorite={handleFavorite}
                  setSelectedCandidate={(candidate) =>
                    setSelectedCandidateId(candidate.id!)
                  }
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
        onClose={() => setSelectedCandidateId(null)}
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
        onFavorite={handleFavorite}
      />

      {selectedCandidates.length > 0 && (
        <BulkActions
          selectedCandidates={selectedCandidates}
          candidates={candidates}
          onDelete={handleBulkDelete}
          onFavorite={handleBulkFavorite}
          onExport={onExportSelected}
        />
      )}
    </>
  );
};
