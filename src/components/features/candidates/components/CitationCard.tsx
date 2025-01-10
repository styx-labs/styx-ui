import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Citation } from "../../../../types";

interface CitationCardProps {
  citation: Citation;
  index: number;
  citationKey: string;
  isExpanded: boolean;
  onToggleExpand: (key: string) => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({
  citation,
  index,
  citationKey,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              {index + 1}
            </span>
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 hover:underline text-sm font-medium truncate"
            >
              {citation.url}
            </a>
          </div>
          <div
            className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              citation.confidence >= 0.8
                ? "bg-green-100 text-green-800"
                : citation.confidence >= 0.6
                ? "bg-blue-100 text-blue-800"
                : citation.confidence >= 0.4
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {Math.round(citation.confidence * 100)}% confidence
          </div>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => onToggleExpand(citationKey)}
        >
          <div className="text-gray-400">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          <span className="text-sm text-gray-600">
            {isExpanded ? "Show less" : "Show more"}
          </span>
        </div>
        {isExpanded && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap pt-2 border-t border-gray-100">
            {citation.distilled_content}
          </p>
        )}
      </div>
    </div>
  );
};
