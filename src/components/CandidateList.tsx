import React, { useState } from "react";
import { Mail, Trash2, Linkedin, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Candidate } from "../types";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

interface CandidateListProps {
  candidates: Candidate[];
  onDeleteCandidate: (candidateId: string) => void;
  onReachout: (candidateId: string, format: string) => void;
  onGetEmail: (linkedinUrl: string) => Promise<string | undefined>;
}


export const CandidateList: React.FC<CandidateListProps> = ({ candidates, onDeleteCandidate, onReachout, onGetEmail }) => {
  const [selectedSections, setSelectedSections] = useState<Record<string, string>>({});
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string>>({});
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

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

  const handleReachout = async (candidateId: string, format: string) => {
    const message = await onReachout(candidateId, format);
    if (message !== undefined) {
      await navigator.clipboard.writeText(message);
      toast.success('Reachout copied to clipboard');
    }
    setOpenDropdownId(null);
  };

  const handleGetEmail = async (linkedinUrl: string | undefined) => {
    if (linkedinUrl) {
      const email = await onGetEmail(linkedinUrl);
      if (email) {
        await navigator.clipboard.writeText(email);
        toast.success('Email copied to clipboard');
      }
    }
  };

  const handleSparklesClick = (e: React.MouseEvent, candidateId: string) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
    setOpenDropdownId(openDropdownId === candidateId ? null : candidateId);
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
                {candidate.url && (
                  <button
                    onClick={() => handleGetEmail(candidate.url)}
                    className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-md"
                  >
                    <Mail size={18} />
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={(e) => handleSparklesClick(e, candidate.id!)}
                    className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-md"
                  >
                    <Sparkles size={18} />
                  </button>
                  
                  {openDropdownId === candidate.id && dropdownPosition && createPortal(
                    <div 
                      className="absolute z-50 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                      style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                      }}
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Choose Generated Message Format
                        </div>
                        <button
                          onClick={() => handleReachout(candidate.id!, 'linkedin')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                        >
                          <Linkedin size={16} /> LinkedIn
                        </button>
                        <button
                          onClick={() => handleReachout(candidate.id!, 'email')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                        >
                          <Mail size={16} /> Email
                        </button>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
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
                      <div className="prose prose-sm max-w-none prose-a:text-purple-600 prose-a:hover:underline">
                        <ReactMarkdown className="markdown">
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
