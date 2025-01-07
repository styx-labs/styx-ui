import React from "react";
import { UserCircle, Trash2, Linkedin } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Candidate } from "../types";

interface CandidateListProps {
  candidates: Candidate[];
  onDeleteCandidate: (candidateId: string) => void;
}

const makeUrlsClickable = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `[${url}](${url})`);
};

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, onDeleteCandidate }) => {
  // Sort completed candidates by overall_score in descending order
  const sortedCandidates = [...candidates].sort((a, b) => {
    // Keep processing candidates at their original position
    if (a.status !== 'complete' || b.status !== 'complete') return 0;
    // Sort completed candidates by overall_score (handle undefined scores)
    return (b.overall_score ?? 0) - (a.overall_score ?? 0);
  });

  return (
    <div className="space-y-6">
      {sortedCandidates.map((candidate) => (
        <div
          key={candidate.id}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {candidate.name}
                </h2>
                {candidate.url && (
                  <a
                    href={candidate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#0A66C2] hover:bg-purple-50 rounded-md transition-colors"
                    title="View LinkedIn Profile"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                <button
                  onClick={() => onDeleteCandidate(candidate.id!)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full ml-auto flex-shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              {candidate.summary && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Summary</h3>
                    {candidate.overall_score !== undefined && (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 mr-2">Overall Score:</span>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          candidate.overall_score >= 8 ? 'bg-green-100 text-green-800' :
                          candidate.overall_score >= 6 ? 'bg-blue-100 text-blue-800' :
                          candidate.overall_score >= 4 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {candidate.overall_score.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{candidate.summary}</p>
                </div>
              )}
              <div className="prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                {candidate.sections ? (
                  candidate.sections.map((section, index) => (
                    <section key={index} className="mb-6 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium m-0">
                          {section.section.charAt(0).toUpperCase() +
                            section.section.slice(1)}
                        </h4>
                        <span className="text-sm text-gray-600">
                          Score: {section.score}
                        </span>
                      </div>
                      <ReactMarkdown className="markdown">
                        {section.content}
                      </ReactMarkdown>
                    </section>
                  ))
                ) : (
                  <p className="text-gray-600">Processing...</p>
                )}
                {candidate.citations ? (
                  <section className="mb-6 last:mb-0">
                    <div className="text-sm text-gray-600">
                      {candidate.citations.map((citation, index) => (
                        <div key={index} className="mb-1">
                          [{index + 1}] &lt;
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            {citation.url}
                          </a>
                          &gt;, Confidence:{" "}
                          <strong>{citation.confidence}</strong>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  <p className="text-gray-600">No citations found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
