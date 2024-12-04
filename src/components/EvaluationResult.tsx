import React from 'react';
import { CandidateEvaluation } from '../types';
import { CheckCircle, AlertTriangle, Link as LinkIcon, Percent, Book } from 'lucide-react';

interface EvaluationResultProps {
  evaluation: CandidateEvaluation;
}

export function EvaluationResult({ evaluation }: EvaluationResultProps) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Evaluation Results</h2>
        <div className="flex items-center gap-2">
          {evaluation.stop_reason === 'final_answer' ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Complete</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Needs More Info</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Percent className="w-4 h-4" />
            <span className="font-medium">Confidence Score</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{evaluation.confidence_score}%</span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <LinkIcon className="w-4 h-4" />
            <span className="font-medium">Sources Found</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{evaluation.total_relevant_links}</span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Book className="w-4 h-4" />
            <span className="font-medium">Research Complete</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{evaluation.research_completeness}%</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{evaluation.summary}</p>
        </div>

        {evaluation.areas_needing_research.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas Needing Research</h3>
            <ul className="space-y-2">
              {evaluation.areas_needing_research.map((area, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Findings</h3>
          <div className="space-y-4">
            {evaluation.collected_links.map((link, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-blue-500 transition-colors duration-200">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  {link.url}
                </a>
                <p className="mt-2 text-gray-700">{link.summary}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Relevance: {link.relevance}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}