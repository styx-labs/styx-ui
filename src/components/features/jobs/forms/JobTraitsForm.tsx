import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { TraitType } from "../../../../types";
import { TraitCard } from "../traits/TraitCard";
import { JobDetailsForm } from "../traits/JobDetailsForm";
import { TraitTips } from "../traits/TraitTips";

interface KeyTrait {
  trait: string;
  description: string;
  trait_type: TraitType;
  value_type?: string;
  required: boolean;
}

interface JobTraitsFormProps {
  suggestedTraits: KeyTrait[];
  jobTitle: string;
  companyName: string;
  onConfirm: (
    traits: KeyTrait[],
    jobTitle: string,
    companyName: string
  ) => void;
  onCancel: () => void;
}

export const JobTraitsForm: React.FC<JobTraitsFormProps> = ({
  suggestedTraits,
  jobTitle: initialJobTitle,
  companyName: initialCompanyName,
  onConfirm,
  onCancel,
}) => {
  const [traits, setTraits] = useState<KeyTrait[]>(suggestedTraits);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [companyName, setCompanyName] = useState(initialCompanyName);

  const addTrait = () => {
    setTraits([
      ...traits,
      {
        trait: "",
        description: "",
        trait_type: TraitType.SCORE,
        required: false,
        value_type: "",
      },
    ]);
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const updateTrait = (index: number, updates: Partial<KeyTrait>) => {
    const newTraits = [...traits];
    newTraits[index] = { ...newTraits[index], ...updates };
    setTraits(newTraits);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Review Key Traits</h2>
        <p className="text-gray-500">
          We've analyzed your job description and identified these key traits.
          Edit them to better match your requirements.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Job Details */}
        <JobDetailsForm
          jobTitle={jobTitle}
          companyName={companyName}
          onJobTitleChange={setJobTitle}
          onCompanyNameChange={setCompanyName}
        />

        {/* Traits List */}
        <div className="space-y-4">
          {traits.map((trait, index) => (
            <TraitCard
              key={index}
              trait={trait}
              index={index}
              onRemove={removeTrait}
              onUpdate={updateTrait}
            />
          ))}
        </div>

        {/* Add Trait Button */}
        <button
          onClick={addTrait}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 group"
        >
          <Plus
            size={16}
            className="group-hover:scale-110 transition-transform"
          />
          Add Another Trait
        </button>

        {/* Tips */}
        <TraitTips />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(traits, jobTitle, companyName)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          <Check size={16} className="mr-2" />
          Create Job
        </button>
      </div>
    </div>
  );
};
