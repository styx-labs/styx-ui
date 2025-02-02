import { Filter, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Job } from "@/types/index";

interface CandidateTraitFilterProps {
  job: Job;
  onFilterChange: (traits: string[]) => void;
}

export function CandidateTraitFilter({
  job,
  onFilterChange,
}: CandidateTraitFilterProps) {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  // Reset filters when job changes
  useEffect(() => {
    setSelectedTraits([]);
    onFilterChange([]);
  }, [job.id, onFilterChange]);

  const handleTraitToggle = (trait: string) => {
    setSelectedTraits((prev) => {
      const newTraits = prev.includes(trait)
        ? prev.filter((t) => t !== trait)
        : [...prev, trait];
      onFilterChange(newTraits);
      return newTraits;
    });
  };

  const handleClearFilters = () => {
    setSelectedTraits([]);
    onFilterChange([]);
  };

  const hasFilters = selectedTraits.length > 0;

  // Group traits by required/optional
  const traitGroups = {
    "Required Traits": job.key_traits.filter((trait) => trait.required),
    "Optional Traits": job.key_traits.filter((trait) => !trait.required),
  };

  // Get trait style based on whether it's required
  const getTraitStyle = (trait: string) => {
    const traitInfo = job.key_traits.find((t) => t.trait === trait);
    return traitInfo?.required
      ? "bg-purple-100 text-purple-700 border-purple-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 border-dashed",
              hasFilters && "border-purple-600 bg-purple-50 text-purple-600"
            )}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter by Traits
            {hasFilters && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedTraits.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedTraits.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedTraits.length} selected
                    </Badge>
                  ) : (
                    selectedTraits.map((trait) => (
                      <Badge
                        variant="secondary"
                        key={trait}
                        className={cn(
                          "rounded-sm px-1 font-normal",
                          getTraitStyle(trait)
                        )}
                      >
                        {trait}
                        {job.key_traits.find((t) => t.trait === trait)
                          ?.required && (
                          <Star className="h-3 w-3 ml-1 fill-current opacity-75 inline-block" />
                        )}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-2 flex items-center justify-between">
            <p className="text-sm font-medium">Filter by traits</p>
            {hasFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="h-auto p-1 text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
          <Separator />
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-4">
              {Object.entries(traitGroups).map(([group, traits]) => (
                <div key={group} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">{group}</h4>
                  <div className="flex flex-wrap gap-2">
                    {traits.map((trait) => {
                      const isSelected = selectedTraits.includes(trait.trait);
                      return (
                        <Badge
                          key={trait.trait}
                          variant="secondary"
                          className={cn(
                            "cursor-pointer transition-colors",
                            isSelected
                              ? getTraitStyle(trait.trait)
                              : "hover:bg-gray-100"
                          )}
                          onClick={() => handleTraitToggle(trait.trait)}
                        >
                          {trait.trait}
                          {trait.required && (
                            <Star className="h-3 w-3 ml-1 fill-current opacity-75 inline-block" />
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {hasFilters && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleClearFilters}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear filters</span>
        </Button>
      )}
    </div>
  );
}
