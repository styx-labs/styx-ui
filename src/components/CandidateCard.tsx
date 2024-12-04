import React from 'react';
import { Candidate } from '../types';
import { Briefcase, Code, Star } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h3 className="text-xl font-semibold mb-2">{candidate.full_name}</h3>
      
      <div className="flex items-center gap-2 text-gray-600 mb-3">
        <Briefcase className="w-4 h-4" />
        <span>{candidate.current_role}</span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Key Skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {candidate.key_skills.map((skill) => (
            <span 
              key={skill}
              className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Notable Experience</span>
        </div>
        <p className="text-gray-600 text-sm">{candidate.notable_experience}</p>
      </div>
    </div>
  );
}