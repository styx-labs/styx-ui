import React from "react";
import { Check, X, Star, Tag, Circle } from "lucide-react";
import { TraitEvaluation, Citation } from "../../../types";

interface TraitValueProps {
  trait: TraitEvaluation;
  citations?: Citation[];
}

export const TraitValue: React.FC<TraitValueProps> = ({ trait, citations }) => {
  const renderValue = () => {
    switch (trait.trait_type) {
      case "TraitType.BOOLEAN": {
        return (
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                trait.value
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {trait.value ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>
            <div
              className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                trait.value
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trait.value ? "Yes" : "No"}
            </div>
          </div>
        );
      }

      case "TraitType.NUMERIC":
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white">
              <span className="text-xs font-bold">#</span>
            </div>
            <div className="flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <span>{trait.value}</span>
              {trait.value_type && (
                <span className="ml-1 text-blue-600/75">
                  {trait.value_type}
                </span>
              )}
            </div>
          </div>
        );

      case "TraitType.SCORE": {
        const score = Number(trait.value);
        const hasCitations = citations && citations.length > 0;
        const showNotEnoughInfo = !hasCitations && score < 7;

        const getScoreColor = (score: number) => {
          if (showNotEnoughInfo) return "bg-gray-500";
          if (score >= 8) return "bg-green-500";
          if (score >= 6) return "bg-blue-500";
          if (score >= 4) return "bg-yellow-500";
          return "bg-red-500";
        };

        return (
          <div className="flex flex-col w-full gap-1">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full ${getScoreColor(
                  score
                )} text-white`}
              >
                <Star className="w-4 h-4" />
              </div>
              <div
                className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                  showNotEnoughInfo
                    ? "bg-gray-100 text-gray-700"
                    : score >= 8
                    ? "bg-green-100 text-green-700"
                    : score >= 6
                    ? "bg-blue-100 text-blue-700"
                    : score >= 4
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {showNotEnoughInfo ? "Not enough information" : `${score}/10`}
              </div>
            </div>
            {!showNotEnoughInfo && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${getScoreColor(score)}`}
                  style={{ width: `${score * 10}%` }}
                />
              </div>
            )}
          </div>
        );
      }

      case "TraitType.CATEGORICAL":
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white">
              <Tag className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              <span>{trait.value}</span>
              {trait.value_type && (
                <>
                  <Circle className="w-1 h-1 fill-current" />
                  <span className="text-purple-600/75">{trait.value_type}</span>
                </>
              )}
            </div>
          </div>
        );

      default:
        return (
          <span className="text-sm text-gray-600">
            {String(trait.trait_type)}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{trait.section}</span>
        {trait.required && (
          <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
            Required
          </span>
        )}
      </div>
      <div className="flex-shrink-0">{renderValue()}</div>
    </div>
  );
};
