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
import { CheckCircle, XCircle, Star, ChevronDown } from "lucide-react";
import { getTraitsMet, getTotalTraits } from "../../utils/traitHelpers";

interface CandidateTraitsProps {
  candidate: Candidate;
}

export const CandidateTraits: React.FC<CandidateTraitsProps> = ({
  candidate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-purple-900">Trait Match</h3>
        <Badge
          variant={
            getTraitsMet(candidate) === getTotalTraits(candidate)
              ? "secondary"
              : "outline"
          }
          className={cn(
            "bg-purple-100 hover:bg-purple-100",
            getTraitsMet(candidate) === getTotalTraits(candidate)
              ? "text-purple-700 border-purple-200"
              : "text-purple-600 border-purple-200"
          )}
        >
          {getTraitsMet(candidate)}/{getTotalTraits(candidate)}
        </Badge>
      </div>
      <Card className="border-purple-100/50">
        <div className="p-4 space-y-3">
          {candidate.sections?.map((section) => (
            <Collapsible key={section.section}>
              <CollapsibleTrigger className="w-full focus-visible:outline-none">
                <div
                  className={cn(
                    "group flex items-center justify-between text-sm p-2.5 rounded-md transition-colors",
                    section.value === true
                      ? "bg-green-50/80 text-green-700 hover:bg-green-100/80"
                      : "bg-red-50/80 text-red-700 hover:bg-red-100/80"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {section.value === true ? (
                      <CheckCircle className="h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0" />
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{section.section}</span>
                      {section.required && (
                        <Star className="h-3 w-3 fill-current opacity-75" />
                      )}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 transform transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="px-4 py-3 mt-1.5 text-sm text-muted-foreground bg-muted/50 rounded-md border border-muted">
                  {section.content}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </Card>
    </div>
  );
};
