import React from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Candidate, TraitType } from "../../../../types";
import { TraitValue } from "../TraitValue";
import { CitationCard } from "./CitationCard";
import { ProfileContent } from "./ProfileContent";
import { transformSection } from "../utils/transformSection";

interface CandidateContentProps {
  candidate: Candidate;
  selectedSection: string;
  selectedTraits: Record<string, string>;
  onTraitToggle: (candidateId: string, traitSection: string) => void;
}

export const CandidateContent: React.FC<CandidateContentProps> = ({
  candidate,
  selectedSection,
  selectedTraits,
  onTraitToggle,
}) => {
  return (
    <div className="mt-4">
      {/* Summary Content */}
      {selectedSection === "summary" && candidate.summary && (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{candidate.summary}</ReactMarkdown>
        </div>
      )}

      {/* Breakdown Content */}
      {selectedSection === "breakdown" && candidate.sections && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidate.sections.map((section) => (
              <div
                key={section.section}
                className={`bg-white rounded-lg shadow-sm border ${
                  transformSection(section).required
                    ? "border-purple-200"
                    : "border-gray-100"
                } transition-all duration-200 hover:shadow-md`}
              >
                <div
                  className={`p-4 cursor-pointer ${
                    selectedTraits[candidate.id!] === section.section
                      ? "bg-purple-50"
                      : ""
                  }`}
                  onClick={() => onTraitToggle(candidate.id!, section.section)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <TraitValue
                        trait={transformSection(section)}
                        citations={candidate.citations}
                      />
                    </div>
                    <div className="ml-2 text-gray-400">
                      {selectedTraits[candidate.id!] === section.section ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  {selectedTraits[candidate.id!] === section.section && (
                    <div className="mt-4 prose prose-sm max-w-none prose-a:text-purple-600 prose-a:hover:underline border-t border-gray-100 pt-4">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citations Content */}
      {selectedSection === "citations" &&
        candidate.citations &&
        candidate.search_mode && (
          <div className="space-y-4">
            {candidate.citations.map((citation, index) => {
              const citationKey = `${candidate.id}-${index}`;
              return (
                <CitationCard
                  key={citationKey}
                  citation={citation}
                  index={index}
                  citationKey={citationKey}
                  isExpanded={selectedTraits[citationKey] === "expanded"}
                  onToggleExpand={(key) =>
                    onTraitToggle(
                      key,
                      selectedTraits[key] === "expanded" ? "" : "expanded"
                    )
                  }
                />
              );
            })}
          </div>
        )}

      {/* Profile Content */}
      {selectedSection === "profile" && candidate.profile && (
        <ProfileContent profile={candidate.profile} />
      )}
    </div>
  );
};
