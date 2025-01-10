import React, { useRef } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { FilterMenu } from "./FilterMenu";

interface CandidateListControlsProps {
  allTraits: string[];
  filters: Array<{ trait: string; minScore: number }>;
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  candidateCount: number;
  onFilterChange: (filters: Array<{ trait: string; minScore: number }>) => void;
  onSortChange: (sortBy: string | null, sortOrder: "asc" | "desc") => void;
}

export const CandidateListControls: React.FC<CandidateListControlsProps> = ({
  allTraits,
  filters,
  sortBy,
  sortOrder,
  candidateCount,
  onFilterChange,
  onSortChange,
}) => {
  const filterMenuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterMenu
            ref={filterMenuRef}
            allTraits={allTraits}
            filters={filters}
            onFilterChange={onFilterChange}
          />

          <select
            value={sortBy || ""}
            onChange={(e) => {
              const value = e.target.value;
              onSortChange(
                value || null,
                value && !sortOrder ? "desc" : sortOrder
              );
            }}
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Sort by Overall Score</option>
            {allTraits.map((trait) => (
              <option key={trait} value={trait}>
                {trait}
              </option>
            ))}
          </select>

          {sortBy && (
            <button
              onClick={() =>
                onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
              }
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md"
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <ArrowUpDown
                size={16}
                className={sortOrder === "asc" ? "rotate-180" : ""}
              />
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          {candidateCount} candidate{candidateCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};
