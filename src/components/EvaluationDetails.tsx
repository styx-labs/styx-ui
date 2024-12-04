import React from 'react';
import { CandidateEvaluation } from '../types';
import { CheckCircle, AlertCircle, Link, Search, BarChart } from 'lucide-react';

interface EvaluationDetailsProps {
  evaluation: CandidateEvaluation;
}

export function EvaluationDetails({ evaluation }: EvaluationDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{evaluation.fullname}</h2>
        <div className="flex items-center gap-2">
          {evaluation.stop_reason === 'final_answer' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
          <span className="text-sm text-gray-600">
            {evaluation.stop_reason === 'final_answer' ? 'Final Answer' : 'Needs More Info'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Confidence Score</span>
          </div>
          <span className="text-2xl font-bold">{evaluation.confidence_score}%</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Relevant Links</span>
          </div>
          <span className="text-2xl font-bold">{evaluation.total_relevant_links}</span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Research Complete</span>
          </div>
          <span className="text-2xl font-bold">{evaluation.research_completeness}%</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Evaluation Summary</h3>
        <p className="text-gray-700 whitespace-pre-line">{evaluation.summary}</p>
      </div>

      {evaluation.areas_needing_research.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Areas Needing Research</h3>
          <ul className="list-disc list-inside text-gray-700">
            {evaluation.areas_needing_research.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-3">Research Findings</h3>
        <div className="space-y-4">
          {evaluation.collected_links.map((link, index) => (
            <div key={index} className="border rounded p-4">
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mb-2 block"
              >
                {link.url}
              </a>
              <p className="text-gray-700 mb-2">{link.summary}</p>
              <p className="text-sm text-gray-600">
                <strong>Relevance:</strong> {link.relevance}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}