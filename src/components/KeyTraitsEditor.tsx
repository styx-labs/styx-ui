import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { TraitType } from "../types";

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
  const [newTrait, setNewTrait] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTraitType, setNewTraitType] = useState<TraitType>("CATEGORICAL");
  const [newValueType, setNewValueType] = useState("");
  const [newRequired, setNewRequired] = useState(false);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [companyName, setCompanyName] = useState(initialCompanyName);

  const addTrait = () => {
    if (newTrait.trim() && !traits.some((t) => t.trait === newTrait.trim())) {
      setTraits([
        ...traits,
        {
          trait: newTrait.trim(),
          description: newDescription.trim(),
          trait_type: newTraitType,
          value_type: newValueType.trim() || undefined,
          required: newRequired,
        },
      ]);
      setNewTrait("");
      setNewDescription("");
      setNewValueType("");
      setNewRequired(false);
      setNewTraitType("CATEGORICAL");
    }
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const renderTraitTypeSelector = (
    currentType: TraitType,
    onChange: (type: TraitType) => void
  ) => (
    <select
      value={currentType}
      onChange={(e) => onChange(e.target.value as TraitType)}
      className="bg-white rounded px-2 py-1 border border-gray-200 focus:border-gray-300 focus:ring-0 text-sm text-gray-600"
    >
      <option value="BOOLEAN">Yes/No</option>
      <option value="NUMERIC">Number</option>
      <option value="SCORE">Score (0-10)</option>
      <option value="CATEGORICAL">Category</option>
    </select>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          Review and Edit Job Details
        </h3>
        <p className="text-sm text-gray-500">
          Review the suggested job details and key traits. You can modify any of
          these fields as needed.
        </p>
      </div>

      {/* Job Title and Company Name */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="jobTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-lg font-medium text-gray-900">Key Traits</h4>
        <p className="text-sm text-gray-500">
          These traits will be used to evaluate candidates. Each trait should
          include a description and type. The more specific you are, the more
          accurate the evaluation will be.
        </p>
      </div>

      {/* Traits List */}
      <div className="space-y-4">
        {traits.map((trait, index) => (
          <div
            key={index}
            className="group flex flex-col gap-2 bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={trait.trait}
                onChange={(e) => {
                  const newTraits = [...traits];
                  newTraits[index] = { ...trait, trait: e.target.value };
                  setTraits(newTraits);
                }}
                className="bg-white rounded px-2 py-1 border border-gray-200 focus:border-gray-300 focus:ring-0 text-sm font-medium text-gray-700 flex-1"
                placeholder="Trait name..."
              />
              {renderTraitTypeSelector(trait.trait_type, (type) => {
                const newTraits = [...traits];
                newTraits[index] = { ...trait, trait_type: type };
                setTraits(newTraits);
              })}
              <button
                onClick={() => removeTrait(index)}
                className="p-1 hover:bg-gray-200 rounded-full flex-shrink-0"
                title="Remove trait"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-4 items-center">
              {trait.trait_type !== "BOOLEAN" && (
                <input
                  type="text"
                  value={trait.value_type || ""}
                  onChange={(e) => {
                    const newTraits = [...traits];
                    newTraits[index] = { ...trait, value_type: e.target.value };
                    setTraits(newTraits);
                  }}
                  className="bg-white rounded px-2 py-1 border border-gray-200 focus:border-gray-300 focus:ring-0 text-sm text-gray-600 flex-1"
                  placeholder={`Value type (e.g., ${
                    trait.trait_type === "NUMERIC"
                      ? "years, dollars"
                      : trait.trait_type === "CATEGORICAL"
                      ? "location, tech_stack"
                      : "score category"
                  })...`}
                />
              )}
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={trait.required}
                  onChange={(e) => {
                    const newTraits = [...traits];
                    newTraits[index] = { ...trait, required: e.target.checked };
                    setTraits(newTraits);
                  }}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Required
              </label>
            </div>

            <textarea
              value={trait.description}
              onChange={(e) => {
                const newTraits = [...traits];
                newTraits[index] = { ...trait, description: e.target.value };
                setTraits(newTraits);
              }}
              className="bg-white rounded px-2 py-1 border border-gray-200 focus:border-gray-300 focus:ring-0 text-sm text-gray-600 w-full resize-none"
              placeholder="Description of why this trait is important..."
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* Add New Trait */}
      <div className="flex flex-col gap-2 border border-gray-200 p-4 rounded-lg">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={newTrait}
            onChange={(e) => setNewTrait(e.target.value)}
            placeholder="New trait name..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          {renderTraitTypeSelector(newTraitType, setNewTraitType)}
        </div>

        <div className="flex gap-4 items-center">
          {newTraitType !== "BOOLEAN" && (
            <input
              type="text"
              value={newValueType}
              onChange={(e) => setNewValueType(e.target.value)}
              placeholder={`Value type (e.g., ${
                newTraitType === "NUMERIC"
                  ? "years, dollars"
                  : newTraitType === "CATEGORICAL"
                  ? "location, tech_stack"
                  : "score category"
              })...`}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          )}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={newRequired}
              onChange={(e) => setNewRequired(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            Required
          </label>
        </div>

        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={2}
        />
        <button
          onClick={addTrait}
          disabled={!newTrait.trim()}
          className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
            newTrait.trim()
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Plus size={16} className="mr-2" />
          Add Trait
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={() => onConfirm(traits, jobTitle, companyName)}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Check size={16} className="mr-2" />
          Confirm Details
        </button>
        <button
          onClick={onCancel}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
