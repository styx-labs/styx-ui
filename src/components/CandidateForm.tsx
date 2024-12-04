import React from 'react';
import { CandidateInput } from '../types';
import { User, Plus, X } from 'lucide-react';

interface CandidateFormProps {
  candidate: CandidateInput;
  onChange: (candidate: CandidateInput) => void;
}

export function CandidateForm({ candidate, onChange }: CandidateFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...candidate,
      [name]: value,
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...candidate.key_skills];
    newSkills[index] = value;
    onChange({
      ...candidate,
      key_skills: newSkills,
    });
  };

  const addSkill = () => {
    onChange({
      ...candidate,
      key_skills: [...candidate.key_skills, ''],
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = candidate.key_skills.filter((_, i) => i !== index);
    onChange({
      ...candidate,
      key_skills: newSkills,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Candidate Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={candidate.full_name}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Role
          </label>
          <input
            type="text"
            name="current_role"
            value={candidate.current_role}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Key Skills
            </label>
            <button
              type="button"
              onClick={addSkill}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>
          <div className="space-y-2">
            {candidate.key_skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notable Experience
          </label>
          <textarea
            name="notable_experience"
            value={candidate.notable_experience}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}