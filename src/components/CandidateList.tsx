import React, { useState } from "react";
import { UserCircle, Trash2, Linkedin, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Candidate } from "../types";

interface CandidateListProps {
  candidates: Candidate[];
  onDeleteCandidate: (candidateId: string) => void;
}

const makeUrlsClickable = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `[[${url}]](${url})`);
};

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, onDeleteCandidate }) => {
  const [visibleSections, setVisibleSections] = useState<Record<string, string>>({});

  const toggleSection = (candidateId: string, sectionName: string) => {
    setVisibleSections(prev => ({
      ...prev,
      [candidateId]: prev[candidateId] === sectionName ? '' : sectionName
    }));
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (a.status !== 'complete' || b.status !== 'complete') return 0;
    return (b.overall_score ?? 0) - (a.overall_score ?? 0);
  });

  return (
    <div className="space-y-4">
      {sortedCandidates.map((candidate) => (
        <div
          key={candidate.id}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {candidate.name}
                </h2>
                {candidate.url && (
                  <a
                    href={candidate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#0A66C2] hover:bg-blue-50 rounded-md"
                    title="View LinkedIn Profile"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {candidate.overall_score !== undefined && (
                  <span className={`px-2 py-0.5 text-sm font-medium rounded ${
                    candidate.overall_score >= 8 ? 'bg-green-100 text-green-800' :
                    candidate.overall_score >= 6 ? 'bg-blue-100 text-blue-800' :
                    candidate.overall_score >= 4 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Score: {candidate.overall_score.toFixed(1)}
                  </span>
                )}
              </div>
              <button
                onClick={() => onDeleteCandidate(candidate.id!)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-2">
              {/* Summary Section */}
              {candidate.summary && (
                <div className="border rounded-md overflow-hidden">
                  <button
                    onClick={() => toggleSection(candidate.id!, 'summary')}
                    className="w-full px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-700">Summary</span>
                    {visibleSections[candidate.id!] === 'summary' ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>
                  {visibleSections[candidate.id!] === 'summary' && (
                    <ReactMarkdown className="px-3 py-2 text-sm text-gray-600">
                      {candidate.summary}
                    </ReactMarkdown>
                  )}
                </div>
              )}

              {/* Other Sections */}
              {candidate.sections?.map((section, index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                  <button
                    onClick={() => toggleSection(candidate.id!, section.section)}
                    className="w-full px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        {section.section.charAt(0).toUpperCase() + section.section.slice(1)}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                        {section.score}
                      </span>
                    </div>
                    {visibleSections[candidate.id!] === section.section ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>
                  {visibleSections[candidate.id!] === section.section && (
                    <div className="px-3 py-2 text-sm">
                      <ReactMarkdown className="markdown">
                        {(section.content)}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}

              {/* Citations Section */}
              {candidate.citations && (
                <div className="border rounded-md overflow-hidden">
                  <button
                    onClick={() => toggleSection(candidate.id!, 'citations')}
                    className="w-full px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-700">Citations</span>
                    {visibleSections[candidate.id!] === 'citations' ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>
                  {visibleSections[candidate.id!] === 'citations' && (
                    <div className="px-3 py-2 text-xs space-y-1.5">
                      {candidate.citations.map((citation, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-600">
                          <span>[{index + 1}]</span>
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            {citation.url}
                          </a>
                          <span className="text-gray-400">•</span>
                          <span>Confidence: {citation.confidence}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
