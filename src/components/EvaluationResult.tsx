import React, { useRef } from 'react';
import { CandidateEvaluation } from '../types';
import { CheckCircle, AlertTriangle, Percent, Book } from 'lucide-react';
import { Summary } from './Summary';
import { ResearchLink } from './ResearchLink';

interface EvaluationResultProps {
  evaluation: CandidateEvaluation;
}

export function EvaluationResult({ evaluation }: EvaluationResultProps) {
  const linkRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCitationClick = (index: number) => {
    linkRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

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
            <Book className="w-4 h-4" />
            <span className="font-medium">Research Complete</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{evaluation.research_completeness}%</span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Areas to Research</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{evaluation.areas_needing_research.length}</span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <Summary 
            text={evaluation.summary} 
            onCitationClick={handleCitationClick}
          />
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
              <ResearchLink
                key={index}
                ref={el => linkRefs.current[index] = el}
                link={link}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}