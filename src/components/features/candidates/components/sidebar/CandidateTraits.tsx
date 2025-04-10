import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types/index";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Star, ChevronDown, Check, X } from "lucide-react";
import {
  getRequiredTraitsMet,
  getOptionalTraitsMet,
  getTotalRequiredTraits,
  getTotalOptionalTraits,
} from "../../utils/traitHelpers";

interface CandidateTraitsProps {
  candidate: Candidate;
  onSourceClick?: (index: number) => void;
}

export const CandidateTraits: React.FC<CandidateTraitsProps> = ({
  candidate,
  onSourceClick,
}) => {
  const [openSections, setOpenSections] = React.useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderTraitContent = (content: string) => {
    const parts = content.split(/(\[\d+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]\(([^)]+)\)/);
      if (match) {
        const [_, index] = match;
        const citationIndex = parseInt(index, 10);
        return (
          <button
            key={i}
            onClick={() => onSourceClick?.(citationIndex)}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            [{index}]
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const totalRequiredTraits = getTotalRequiredTraits(candidate);
  const totalOptionalTraits = getTotalOptionalTraits(candidate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-purple-900">Trait Match</h3>
        <div className="flex items-center gap-2">
          {totalRequiredTraits > 0 && (
            <Badge
              variant={
                getRequiredTraitsMet(candidate) === totalRequiredTraits
                  ? "secondary"
                  : "outline"
              }
              className={cn(
                "bg-purple-100 hover:bg-purple-100",
                getRequiredTraitsMet(candidate) === totalRequiredTraits
                  ? "text-purple-700 border-purple-200"
                  : "text-purple-600 border-purple-200"
              )}
            >
              {getRequiredTraitsMet(candidate)}/{totalRequiredTraits} Required
            </Badge>
          )}
          {totalOptionalTraits > 0 && (
            <Badge
              variant="outline"
              className="text-purple-600 border-purple-200"
            >
              {getOptionalTraitsMet(candidate)}/{totalOptionalTraits} Optional
            </Badge>
          )}
        </div>
      </div>
      <Card className="border-purple-100/50">
        <div className="p-4 space-y-3">
          {candidate.sections?.map((section, index) => (
            <Collapsible
              key={index}
              open={openSections.includes(index)}
              onOpenChange={() => toggleSection(index)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5",
                      section.value === true
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200",
                      section.required ? "shadow-sm" : "opacity-75"
                    )}
                  >
                    {section.value === true ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span className="flex items-center gap-1">
                      {section.section}
                      {section.required ? (
                        <Star className="h-3 w-3 fill-current opacity-75" />
                      ) : null}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    openSections.includes(index) ? "rotate-180" : ""
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="px-4 py-3 mt-1.5 text-sm text-muted-foreground bg-muted/50 rounded-md border border-muted">
                  {renderTraitContent(section.content)}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </Card>
    </div>
  );
};
