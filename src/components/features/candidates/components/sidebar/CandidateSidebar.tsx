import React, { useEffect, useRef } from "react";
import type { Candidate } from "@/types/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { CandidateHeader } from "./CandidateHeader";
import { CandidateTraits } from "./CandidateTraits";
import { CandidateProfile } from "./CandidateProfile";
import { cn } from "@/lib/utils";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFitScoreLabel } from "../../utils/traitHelpers";

interface CandidateSidebarProps {
  candidate: Candidate | null;
  jobId: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  loadingStates: { [key: string]: { email: boolean; message: boolean } };
  onGetEmail: (url: string, id: string) => Promise<void>;
  onReachout: (id: string, format: string) => Promise<void>;
  onDelete: (e: React.MouseEvent, id: string) => Promise<void>;
  onFavorite?: (id: string) => Promise<void>;
  onRefresh?: () => void;
}

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  candidate,
  jobId,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  loadingStates,
  onGetEmail,
  onReachout,
  onDelete,
  onFavorite,
  onRefresh,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const citationRefs = useRef<{ [key: number]: HTMLDivElement }>({});

  const scrollToSource = (index: number) => {
    const element = citationRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && hasPrevious) {
        onPrevious();
      } else if (event.key === "ArrowRight" && hasNext) {
        onNext();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks on dropdown menus and their content. This is for the generate reachout menu.
      const target = event.target as HTMLElement;
      if (
        target.closest('[role="menu"]') ||
        target.closest('[role="menuitem"]') ||
        target.closest('[role="dialog"]')
      ) {
        return;
      }

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext]);

  if (!candidate) return null;

  const { variant, label } = getFitScoreLabel(candidate.fit);

  return (
    <div
      ref={sidebarRef}
      className="fixed inset-y-0 right-0 w-[600px] border-l bg-background shadow-2xl animate-in slide-in-from-right duration-300 rounded-l-xl"
    >
      <div className="h-full flex flex-col">
        <CandidateHeader
          candidate={candidate}
          jobId={jobId}
          loadingStates={loadingStates}
          onClose={onClose}
          onPrevious={onPrevious}
          onNext={onNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onEmail={onGetEmail}
          onReachout={onReachout}
          onDelete={onDelete}
          onFavorite={onFavorite}
          onRefresh={onRefresh}
        />

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <CandidateTraits
              candidate={candidate}
              onSourceClick={scrollToSource}
            />

            {/* Summary Section */}
            {candidate.summary && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-purple-900">
                    Summary
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={variant}
                      className={cn(
                        "font-medium hover:bg-inherit",
                        candidate.fit !== undefined &&
                          candidate.fit === 4 &&
                          candidate.fit === 4 &&
                          "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
                        candidate.fit === 3 &&
                          "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
                        candidate.fit === 2 &&
                          "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
                        candidate.fit !== undefined &&
                          candidate.fit <= 1 &&
                          "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                      )}
                    >
                      {label}
                    </Badge>
                  </div>
                </div>
                <Card className="border-purple-100/50">
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {candidate.summary}
                    </p>
                  </div>
                </Card>
              </div>
            )}

            <CandidateProfile candidate={candidate} />

            {candidate.citations && candidate.citations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-purple-900">Sources</h3>
                <div className="space-y-4">
                  {candidate.citations.map((citation, index) => (
                    <Card
                      key={index}
                      ref={(el) => {
                        if (el) citationRefs.current[citation.index] = el;
                      }}
                      className="overflow-hidden transition-all duration-300 hover:shadow-lg scroll-mt-6"
                    >
                      <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 text-purple-700 font-semibold text-lg">
                              {citation.index}
                            </div>
                            <div>
                              <CardTitle className="text-sm font-medium text-purple-900">
                                {new URL(citation.url).hostname}
                              </CardTitle>
                              <a
                                href={citation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-600 hover:text-purple-800 transition-colors flex items-center mt-1"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Visit source
                              </a>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "px-2 py-1 text-xs font-medium",
                              citation.confidence >= 0.8
                                ? "bg-green-100 text-green-800 border-green-200"
                                : citation.confidence >= 0.6
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            )}
                          >
                            {Math.round(citation.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {citation.distilled_content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
