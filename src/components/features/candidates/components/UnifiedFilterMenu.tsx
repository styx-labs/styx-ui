import React, { useState } from "react";
import { Filter, Star, X } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KeyTrait {
  trait: string;
  required: boolean;
  description: string;
}

interface Job {
  key_traits: KeyTrait[];
}

interface UnifiedFilterMenuProps {
  job: Job;
  onTraitFilterChange: (traits: string[]) => void;
  onCareerTagChange: (tags: string[]) => void;
  onFavoriteChange: (showFavorites: boolean) => void;
  onFitScoreChange: (scores: number[]) => void;
  selectedTraits: string[];
  selectedCareerTags: string[];
  showFavorites: boolean;
  selectedFitScores: number[];
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

export function UnifiedFilterMenu({
  job,
  onTraitFilterChange,
  onCareerTagChange,
  onFavoriteChange,
  onFitScoreChange,
  selectedTraits,
  selectedCareerTags,
  showFavorites,
  selectedFitScores,
}: UnifiedFilterMenuProps) {
  const [activeTab, setActiveTab] = useState("traits");

  const hasFilters =
    selectedTraits.length > 0 ||
    selectedCareerTags.length > 0 ||
    showFavorites ||
    selectedFitScores.length > 0;

  const handleTraitToggle = (trait: string) => {
    onTraitFilterChange(
      selectedTraits.includes(trait)
        ? selectedTraits.filter((t) => t !== trait)
        : [...selectedTraits, trait]
    );
  };

  const handleCareerTagToggle = (tag: string) => {
    onCareerTagChange(
      selectedCareerTags.includes(tag)
        ? selectedCareerTags.filter((t) => t !== tag)
        : [...selectedCareerTags, tag]
    );
  };

  const handleFitScoreToggle = (score: number) => {
    onFitScoreChange(
      selectedFitScores.includes(score)
        ? selectedFitScores.filter((s) => s !== score)
        : [...selectedFitScores, score].sort((a, b) => b - a)
    );
  };

  const handleClearFilters = () => {
    onTraitFilterChange([]);
    onCareerTagChange([]);
    onFavoriteChange(false);
    onFitScoreChange([]);
  };

  // Group traits by required/optional
  const traitGroups = {
    "Required Traits": job.key_traits.filter((trait) => trait.required),
    "Optional Traits": job.key_traits.filter((trait) => !trait.required),
  };

  // Get trait style based on whether it's required
  const getTraitStyle = (trait: string): string => {
    const traitInfo = job.key_traits.find((t: KeyTrait) => t.trait === trait);
    return traitInfo?.required
      ? "bg-purple-100 text-purple-700 border-purple-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

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
            Filters
            {hasFilters && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedTraits.length +
                    selectedCareerTags.length +
                    (showFavorites ? 1 : 0) +
                    selectedFitScores.length}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-2 flex items-center justify-between">
            <p className="text-sm font-medium">Filters</p>
            {hasFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="h-auto p-1 text-xs"
              >
                Clear all filters
              </Button>
            )}
          </div>
          <Separator />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-gray-200 p-1">
              <TabsTrigger value="traits" className="flex-1 data-[state=active]:bg-white">
                Traits {selectedTraits.length > 0 && `(${selectedTraits.length})`}
              </TabsTrigger>
              <TabsTrigger value="tags" className="flex-1 data-[state=active]:bg-white">
                Tags {selectedCareerTags.length > 0 && `(${selectedCareerTags.length})`}
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1 data-[state=active]:bg-white">
                Favorites {showFavorites && "(1)"}
              </TabsTrigger>
              <TabsTrigger value="fit" className="flex-1 data-[state=active]:bg-white">
                Fit Score {selectedFitScores.length > 0 && `(${selectedFitScores.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="traits" className="m-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-4">
                  {Object.entries(traitGroups).map(([group, traits]) => (
                    <div key={group} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        {group}
                      </h4>
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
            </TabsContent>

            <TabsContent value="tags" className="m-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-4">
                  {Object.entries(CAREER_TAG_GROUPS).map(([group, tags]) => (
                    <div key={group} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        {group}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                          const isSelected = selectedCareerTags.includes(tag);
                          return (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className={cn(
                                "cursor-pointer transition-colors",
                                isSelected ? getTagStyle(tag) : "hover:bg-gray-100"
                              )}
                              onClick={() => handleCareerTagToggle(tag)}
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
            </TabsContent>

            <TabsContent value="favorites" className="m-0">
              <div className="p-4">
                <Button
                  variant={showFavorites ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full h-9 gap-2",
                    showFavorites &&
                      "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  )}
                  onClick={() => onFavoriteChange(!showFavorites)}
                >
                  <Star
                    className={cn("h-4 w-4", showFavorites && "fill-yellow-400")}
                  />
                  {showFavorites ? "Hide Favorites" : "Show Favorites"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="fit" className="m-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-2">
                  {[4, 3, 2, 1, 0].map((score) => (
                    <Button
                      key={score}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFitScoreToggle(score)}
                      className={cn(
                        "w-full justify-start gap-2 h-9",
                        selectedFitScores.includes(score) &&
                          "bg-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          score === 4 && "bg-green-500",
                          score === 3 && "bg-blue-500",
                          score === 2 && "bg-yellow-500",
                          score === 1 && "bg-orange-500",
                          score === 0 && "bg-red-500"
                        )}
                      />
                      <span className="flex-1 text-left">
                        {score === 4 && "Ideal Fit"}
                        {score === 3 && "Good Fit"}
                        {score === 2 && "Potential Fit"}
                        {score === 1 && "Likely Not Fit"}
                        {score === 0 && "Not Fit"}
                      </span>
                      {selectedFitScores.includes(score) && (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
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