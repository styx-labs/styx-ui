import React, { useEffect, useRef } from "react";
import type { Candidate } from "@/types/index";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { CandidateHeader } from "./CandidateHeader";
import { CandidateTraits } from "./CandidateTraits";
import { CandidateProfile } from "./CandidateProfile";

interface CandidateSidebarProps {
  candidate: Candidate | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  loadingStates: { [key: string]: { email: boolean; message: boolean } };
  onGetEmail?: (url: string, id: string) => Promise<void>;
  onReachout?: (id: string, format: string) => Promise<void>;
  onDelete?: (e: React.MouseEvent, id: string) => Promise<void>;
}

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  candidate,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  loadingStates,
  onGetEmail,
  onReachout,
  onDelete,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={sidebarRef}
      className="fixed inset-y-0 right-0 w-[600px] border-l bg-background shadow-xl animate-in slide-in-from-right duration-300"
    >
      <div className="h-full flex flex-col">
        <CandidateHeader
          candidate={candidate}
          loadingStates={loadingStates}
          onClose={onClose}
          onPrevious={onPrevious}
          onNext={onNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onLinkedIn={(url) => window.open(url, "_blank")}
          onEmail={onGetEmail!}
          onReachout={onReachout!}
          onDelete={onDelete!}
        />

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <CandidateTraits candidate={candidate} />

            {/* Summary Section */}
            {candidate.summary && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-purple-900">Summary</h3>
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
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
