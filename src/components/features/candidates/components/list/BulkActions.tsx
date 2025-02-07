import React from "react";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Download } from "lucide-react";
import type { Candidate } from "@/types/index";
import { cn } from "@/lib/utils";

interface BulkActionsProps {
  selectedCandidates: string[];
  candidates: Candidate[];
  onDelete?: (ids: string[]) => Promise<void>;
  onFavorite?: (ids: string[]) => Promise<void>;
  onExport?: (ids: string[]) => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCandidates,
  candidates,
  onDelete,
  onFavorite,
  onExport,
}) => {
  if (selectedCandidates.length === 0) return null;

  const handleBulkDelete = async () => {
    if (!onDelete) return;
    await onDelete(selectedCandidates);
  };

  const handleBulkFavorite = async () => {
    if (!onFavorite) return;
    await onFavorite(selectedCandidates);
  };

  const handleExport = () => {
    if (!onExport) return;
    onExport(selectedCandidates);
  };

  // Check if all selected candidates are favorited using the current state
  const selectedCandidateObjects = candidates.filter(
    (c) => c.id && selectedCandidates.includes(c.id)
  );
  const allFavorited =
    selectedCandidateObjects.length > 0 &&
    selectedCandidateObjects.every((c) => c.favorite);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-4 z-50 flex items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">
        {selectedCandidates.length} candidate
        {selectedCandidates.length !== 1 ? "s" : ""} selected
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkFavorite}
          className="gap-2"
        >
          <Star className={cn("h-4 w-4", allFavorited && "fill-yellow-400")} />
          {allFavorited ? "Unstar Selected" : "Star Selected"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkDelete}
          className="gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Remove Selected
        </Button>
      </div>
    </div>
  );
};
