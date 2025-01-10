import React from "react";
import { X, Hash, Scale, List } from "lucide-react";
import { TraitType } from "../../../../types";

interface KeyTrait {
  trait: string;
  description: string;
  trait_type: TraitType;
  value_type?: string;
  required: boolean;
}

interface TraitCardProps {
  trait: KeyTrait;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updates: Partial<KeyTrait>) => void;
}

export const TraitCard: React.FC<TraitCardProps> = ({
  trait,
  index,
  onRemove,
  onUpdate,
}) => {
  const getTraitTypeLabel = (type: TraitType) => {
    switch (type) {
      case TraitType.BOOLEAN:
        return "Yes/No";
      //   case TraitType.NUMERIC:
      // return "Number";
      case TraitType.SCORE:
        return "Score (0-10)";
      // case TraitType.CATEGORICAL:
      //   return "Category";
    }
  };

  const getValueTypePlaceholder = (type: TraitType) => {
    switch (type) {
      //   case TraitType.NUMERIC:
      // return "e.g., years, dollars";
      //   case TraitType.CATEGORICAL:
      // return "e.g., location, tech_stack";
      case TraitType.SCORE:
        return "e.g., proficiency level";
      default:
        return "";
    }
  };

  const getTraitTypeIcon = (type: TraitType) => {
    switch (type) {
      //   case TraitType.NUMERIC:
      // return <Hash className="w-4 h-4" />;
      case TraitType.SCORE:
        return <Scale className="w-4 h-4" />;
      //   case TraitType.CATEGORICAL:
      // return <List className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="group relative bg-gray-50 rounded-lg p-4 pr-12 border border-gray-200 hover:border-purple-200 transition-colors">
      <button
        onClick={() => onRemove(index)}
        className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        title="Remove trait"
      >
        <X size={16} />
      </button>

      <div className="space-y-4">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
          <input
            value={trait.trait}
            onChange={(e) => onUpdate(index, { trait: e.target.value })}
            placeholder="Trait name..."
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />

          <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap px-2 py-1 bg-white rounded-lg border border-gray-200">
            <input
              type="checkbox"
              checked={trait.required}
              onChange={(e) => onUpdate(index, { required: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            Required
          </label>

          <select
            value={trait.trait_type}
            onChange={(e) =>
              onUpdate(index, { trait_type: e.target.value as TraitType })
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
              onChange={(e) => onUpdate(index, { value_type: e.target.value })}
              placeholder={getValueTypePlaceholder(trait.trait_type)}
              className="w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-sm text-gray-500">
                {trait.trait_type === TraitType.SCORE ? "Scale" : ""}
              </span>
            </div>
          </div>
        )}

        <textarea
          value={trait.description}
          onChange={(e) => onUpdate(index, { description: e.target.value })}
          placeholder="Description of why this trait is important..."
          rows={2}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 resize-none"
        />
      </div>
    </div>
  );
};
