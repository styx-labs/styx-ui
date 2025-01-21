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
  onBack: () => void;
}

export const JobTraitsForm: React.FC<JobTraitsFormProps> = ({
  suggestedTraits,
  jobTitle: initialJobTitle,
  companyName: initialCompanyName,
  onConfirm,
  onBack,
}) => {
  const [traits, setTraits] = useState<KeyTrait[]>(suggestedTraits);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(traits, jobTitle, companyName);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Review Key Traits</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          We've analyzed your job description and identified these key traits.
          Edit them to better match your requirements.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
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
          className="w-full py-2.5 text-sm text-gray-500 hover:text-purple-600 flex items-center justify-center gap-1.5 group"
        >
          <span className="h-5 w-5 rounded-full border-2 border-gray-300 inline-flex items-center justify-center group-hover:border-purple-300 group-hover:bg-purple-50 transition-all">
            <Plus size={14} className="group-hover:scale-110 transition-transform" />
          </span>
          Add another trait
        </button>

        {/* Tips */}
        <TraitTips />

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                Creating Job...
              </>
            ) : (
              <>
                <Check size={18} />
                Create Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
