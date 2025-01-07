import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";

interface KeyTraitsEditorProps {
  suggestedTraits: string[];
  onConfirm: (traits: string[]) => void;
  onCancel: () => void;
}

export const KeyTraitsEditor: React.FC<KeyTraitsEditorProps> = ({
  suggestedTraits,
  onConfirm,
  onCancel,
}) => {
  const [traits, setTraits] = useState<string[]>(suggestedTraits);
  const [newTrait, setNewTrait] = useState("");

  const addTrait = () => {
    if (newTrait.trim() && !traits.includes(newTrait.trim())) {
      setTraits([...traits, newTrait.trim()]);
      setNewTrait("");
    }
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">Edit Key Traits</h3>
        <p className="text-sm text-gray-500">
          These traits will be used to evaluate candidates. You can add, edit,
          or remove traits as needed.
        </p>
      </div>

      {/* Traits List */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {traits.map((trait, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full"
            >
              <input
                type="text"
                value={trait}
                onChange={(e) => {
                  const newTraits = [...traits];
                  newTraits[index] = e.target.value;
                  setTraits(newTraits);
                }}
                className="bg-transparent border-none p-0 focus:ring-0 text-sm min-w-[400px] w-auto"
              />
              <button
                onClick={() => removeTrait(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-purple-100 rounded-full flex-shrink-0"
                title="Remove trait"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Trait */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newTrait}
            onChange={(e) => setNewTrait(e.target.value)}
            placeholder="Add new trait..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pr-10"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTrait();
              }
            }}
          />
          {newTrait && (
            <button
              onClick={addTrait}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
              title="Add trait"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-500">
        Press Enter or click the plus icon to add a trait
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={() => onConfirm(traits)}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Check size={16} className="mr-2" />
          Confirm Key Traits
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
