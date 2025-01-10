import React, { useState, forwardRef } from "react";
import { SlidersHorizontal } from "lucide-react";

interface FilterMenuProps {
  allTraits: string[];
  filters: Array<{ trait: string; minScore: number }>;
  onFilterChange: (filters: Array<{ trait: string; minScore: number }>) => void;
}

export const FilterMenu = forwardRef<HTMLDivElement, FilterMenuProps>(
  ({ allTraits, filters, onFilterChange }, ref) => {
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [currentFilter, setCurrentFilter] = useState<{
      trait: string;
      minScore: number;
    }>({ trait: "", minScore: 6 });

    const handleAddFilter = () => {
      if (currentFilter.trait) {
        onFilterChange([...filters, currentFilter]);
        setCurrentFilter({ trait: "", minScore: 6 });
      }
    };

    const handleRemoveFilter = (index: number) => {
      onFilterChange(filters.filter((_, i) => i !== index));
    };

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
        >
          <SlidersHorizontal size={16} />
          {filters.length > 0 ? `Filters (${filters.length})` : "Filter"}
        </button>

        {/* Active filters display */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm"
              >
                <span>
                  {filter.trait} ≥ {filter.minScore}
                </span>
                <button
                  onClick={() => handleRemoveFilter(index)}
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {isFilterMenuOpen && (
          <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="p-3 space-y-3">
              {/* Active Filters */}
              {filters.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Active Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm"
                      >
                        <span>
                          {filter.trait} ≥ {filter.minScore}
                        </span>
                        <button
                          onClick={() => handleRemoveFilter(index)}
                          className="ml-1 hover:text-purple-900"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Filter
                </label>
                <div className="flex gap-2">
                  <select
                    value={currentFilter.trait}
                    onChange={(e) =>
                      setCurrentFilter((prev) => ({
                        ...prev,
                        trait: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Select trait...</option>
                    {allTraits
                      .filter(
                        (trait) => !filters.some((f) => f.trait === trait)
                      )
                      .map((trait) => (
                        <option key={trait} value={trait}>
                          {trait}
                        </option>
                      ))}
                  </select>
                  {currentFilter.trait && (
                    <select
                      value={currentFilter.minScore}
                      onChange={(e) =>
                        setCurrentFilter((prev) => ({
                          ...prev,
                          minScore: Number(e.target.value),
                        }))
                      }
                      className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      {[0, 2, 4, 6, 8].map((score) => (
                        <option key={score} value={score}>
                          ≥ {score}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    onFilterChange([]);
                    setCurrentFilter({ trait: "", minScore: 6 });
                    setIsFilterMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
                {currentFilter.trait && (
                  <button
                    onClick={handleAddFilter}
                    className="px-3 py-1.5 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    Add Filter
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
