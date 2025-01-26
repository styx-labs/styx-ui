import { Filter, X } from "lucide-react";
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
import { useEffect, useState } from "react";
import type { Candidate } from "@/types";

interface CandidateTraitFilterProps {
  candidates: Candidate[];
  onFilterChange: (traits: string[]) => void;
}

export function CandidateTraitFilter({
  candidates,
  onFilterChange,
}: CandidateTraitFilterProps) {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [availableTraits, setAvailableTraits] = useState<string[]>([]);

  // Extract unique traits from candidates
  useEffect(() => {
    const traits = new Set<string>();
    candidates.forEach((candidate) => {
      candidate.sections?.forEach((section) => {
        if (section.section) {
          traits.add(section.section);
        }
      });
    });
    setAvailableTraits(Array.from(traits).sort());
  }, [candidates]);

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
                        className="rounded-sm px-1 font-normal"
                      >
                        {trait}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
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
          <ScrollArea className="h-[300px]">
            <div className="grid gap-1 p-2">
              {availableTraits.map((trait) => {
                const isSelected = selectedTraits.includes(trait);
                return (
                  <Button
                    key={trait}
                    variant={isSelected ? "secondary" : "ghost"}
                    className={cn(
                      "justify-start font-normal",
                      isSelected && "bg-purple-100 text-purple-700"
                    )}
                    onClick={() => handleTraitToggle(trait)}
                  >
                    {trait}
                  </Button>
                );
              })}
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
