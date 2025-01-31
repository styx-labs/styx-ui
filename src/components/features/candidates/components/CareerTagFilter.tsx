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
import { useState, useEffect } from "react";

interface CareerTagFilterProps {
  onFilterChange: (tags: string[]) => void;
}

const CAREER_TAG_GROUPS = {
  "Career Progression": [
    "High Average Tenure",
    "Low Average Tenure",
    "Single Promotion",
    "Multiple Promotions",
    "Diverse Company Experience",
    "Single Company Focus",
  ],
  "Company Type": [
    "Worked at Big Tech",
    "Worked at Unicorn",
    "Worked at Quant Fund",
  ],
  "Company Stage": [
    "Startup Experience",
    "Growth Company Experience",
    "Public Company Experience",
  ],
};

export function CareerTagFilter({ onFilterChange }: CareerTagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];
      onFilterChange(newTags);
      return newTags;
    });
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    onFilterChange([]);
  };

  const hasFilters = selectedTags.length > 0;

  const getTagStyle = (tag: string): string => {
    switch (tag) {
      // Career Progression Tags
      case "High Average Tenure":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Low Average Tenure":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Single Promotion":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Multiple Promotions":
        return "bg-green-50 text-green-700 border-green-200";
      case "Diverse Company Experience":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "Single Company Focus":
        return "bg-teal-50 text-teal-700 border-teal-200";

      // Company Type Tags
      case "Worked at Big Tech":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Worked at Unicorn":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "Worked at Quant Fund":
        return "bg-purple-50 text-purple-700 border-purple-200";

      // Company Stage Tags
      case "Startup Experience":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Growth Company Experience":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Public Company Experience":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
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
            Filter by Tags
            {hasFilters && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedTags.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedTags.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedTags.length} selected
                    </Badge>
                  ) : (
                    selectedTags.map((tag) => (
                      <Badge
                        variant="secondary"
                        key={tag}
                        className="rounded-sm px-1 font-normal"
                      >
                        {tag}
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
            <p className="text-sm font-medium">Filter by career tags</p>
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
              {Object.entries(CAREER_TAG_GROUPS).map(([group, tags]) => (
                <div key={group} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">{group}</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={cn(
                            "cursor-pointer transition-colors",
                            isSelected ? getTagStyle(tag) : "hover:bg-gray-100"
                          )}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
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
