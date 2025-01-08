import React, { useState } from "react";
import { UserCircle, Trash2, Linkedin, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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
  const [selectedSections, setSelectedSections] = useState<Record<string, string>>({});
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string>>({});

  const toggleSection = (candidateId: string, sectionName: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [candidateId]: prev[candidateId] === sectionName ? '' : sectionName
    }));
    // Clear selected trait when changing sections
    if (sectionName !== 'breakdown') {
      setSelectedTraits(prev => ({
        ...prev,
        [candidateId]: ''
      }));
    }
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
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {candidate.name}
                  {candidate.status === "processing" && (
                    <Loader2 size={16} className="animate-spin text-purple-600" />
                  )}
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

            {/* Section Navigation */}
            <div className="flex gap-3 mb-4">
              {candidate.summary && (
                <button
                  onClick={() => toggleSection(candidate.id!, 'summary')}
                  className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
                    selectedSections[candidate.id!] === 'summary'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Summary
                </button>
              )}
              {candidate.sections && candidate.sections.length > 0 && (
                <button
                  onClick={() => toggleSection(candidate.id!, 'breakdown')}
                  className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
                    selectedSections[candidate.id!] === 'breakdown'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Breakdown
                </button>
              )}
              {candidate.citations && (
                <button
                  onClick={() => toggleSection(candidate.id!, 'citations')}
                  className={`flex-1 px-3 py-1.5 text-center rounded-md transition-colors text-sm ${
                    selectedSections[candidate.id!] === 'citations'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Citations
                </button>
              )}
            </div>

            {/* Content Display */}
            <div className="mt-4">
              {/* Summary Content */}
              {selectedSections[candidate.id!] === 'summary' && candidate.summary && (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{candidate.summary}</ReactMarkdown>
                </div>
              )}

              {/* Breakdown Content */}
              {selectedSections[candidate.id!] === 'breakdown' && candidate.sections && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {candidate.sections.map((section) => (
                      <button
                        key={section.section}
                        onClick={() => setSelectedTraits(prev => ({
                          ...prev,
                          [candidate.id!]: prev[candidate.id!] === section.section ? '' : section.section
                        }))}
                        className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedTraits[candidate.id!] === section.section
                            ? 'bg-purple-100 text-purple-800 border-2 border-purple-200'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{section.section.charAt(0).toUpperCase() + section.section.slice(1)}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          selectedTraits[candidate.id!] === section.section
                            ? 'bg-purple-200 text-purple-800'
                            : 'bg-white text-gray-600'
                        }`}>
                          {section.score}
                        </span>
                      </button>
                    ))}
                  </div>
                  {selectedTraits[candidate.id!] && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>
                          {candidate.sections.find(s => s.section === selectedTraits[candidate.id!])?.content || ''}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Citations Content */}
              {selectedSections[candidate.id!] === 'citations' && candidate.citations && (
                <div className="space-y-2">
                  {candidate.citations.map((citation, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
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
          </div>
        </div>
      ))}
    </div>
  );
};
