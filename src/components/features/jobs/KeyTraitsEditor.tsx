import React, { useState } from "react";
import { X, Plus, Check, AlertCircle, Scale, Hash, List } from "lucide-react";
import { TraitType } from "../../../types";

interface KeyTrait {
  trait: string;
  description: string;
  trait_type: TraitType;
  value_type?: string;
  required: boolean;
}

interface KeyTraitsEditorProps {
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

export const KeyTraitsEditor: React.FC<KeyTraitsEditorProps> = ({
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
        trait_type: TraitType.CATEGORICAL,
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

  const getTraitTypeLabel = (type: TraitType) => {
    switch (type) {
      case TraitType.BOOLEAN:
        return "Yes/No";
      case TraitType.NUMERIC:
        return "Number";
      case TraitType.SCORE:
        return "Score (0-10)";
      case TraitType.CATEGORICAL:
        return "Category";
    }
  };

  const getValueTypePlaceholder = (type: TraitType) => {
    switch (type) {
      case TraitType.NUMERIC:
        return "e.g., years, dollars";
      case TraitType.CATEGORICAL:
        return "e.g., location, tech_stack";
      case TraitType.SCORE:
        return "e.g., proficiency level";
      default:
        return "";
    }
  };

  const getTraitTypeIcon = (type: TraitType) => {
    switch (type) {
      case TraitType.NUMERIC:
        return <Hash className="w-4 h-4" />;
      case TraitType.SCORE:
        return <Scale className="w-4 h-4" />;
      case TraitType.CATEGORICAL:
        return <List className="w-4 h-4" />;
      default:
        return null;
    }
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Traits List */}
        <div className="space-y-4">
          {traits.map((trait, index) => (
            <div
              key={index}
              className="group relative bg-gray-50 rounded-lg p-4 pr-12 border border-gray-200 hover:border-purple-200 transition-colors"
            >
              <button
                onClick={() => removeTrait(index)}
                className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Remove trait"
              >
                <X size={16} />
              </button>

              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
                  <input
                    value={trait.trait}
                    onChange={(e) =>
                      updateTrait(index, { trait: e.target.value })
                    }
                    placeholder="Trait name..."
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />

                  <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap px-2 py-1 bg-white rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={trait.required}
                      onChange={(e) =>
                        updateTrait(index, { required: e.target.checked })
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Required
                  </label>

                  <select
                    value={trait.trait_type}
                    onChange={(e) =>
                      updateTrait(index, {
                        trait_type: e.target.value as TraitType,
                      })
                    }
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    {Object.values(TraitType).map((type) => (
                      <option key={type} value={type}>
                        {getTraitTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                {trait.trait_type !== TraitType.BOOLEAN && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {getTraitTypeIcon(trait.trait_type)}
                    </div>
                    <input
                      value={trait.value_type || ""}
                      onChange={(e) =>
                        updateTrait(index, { value_type: e.target.value })
                      }
                      placeholder={getValueTypePlaceholder(trait.trait_type)}
                      className="w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-sm text-gray-500">
                        {trait.trait_type === TraitType.NUMERIC
                          ? "Units"
                          : trait.trait_type === TraitType.SCORE
                          ? "Scale"
                          : trait.trait_type === TraitType.CATEGORICAL
                          ? "Categories"
                          : ""}
                      </span>
                    </div>
                  </div>
                )}

                <textarea
                  value={trait.description}
                  onChange={(e) =>
                    updateTrait(index, { description: e.target.value })
                  }
                  placeholder="Description of why this trait is important..."
                  rows={2}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
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

        {/* Info Box */}
        <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Tips for better evaluations:</p>
            <ul className="list-disc list-inside space-y-1 text-purple-700">
              <li>Use clear, specific trait names</li>
              <li>Add detailed descriptions to guide the evaluation</li>
              <li>Mark critical requirements as "Required"</li>
              <li>Choose appropriate trait types for accurate scoring</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
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
