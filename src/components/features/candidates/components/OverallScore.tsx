import React from "react";
import { Citation } from "../../../../types";

interface OverallScoreProps {
  score: number;
  citations?: Citation[];
  search_mode?: boolean;
}

const getScoreBucket = (score: number) => {
  if (score >= 9)
    return { text: "Exceptional", color: "bg-green-100 text-green-800" };
  if (score >= 7)
    return { text: "Strong fit", color: "bg-emerald-100 text-emerald-800" };
  if (score >= 5)
    return { text: "Potential fit", color: "bg-blue-100 text-blue-800" };
  if (score >= 3)
    return { text: "Weak fit", color: "bg-yellow-100 text-yellow-800" };
  return { text: "Not a fit", color: "bg-red-100 text-red-800" };
};

const hasEnoughInformation = (citations?: Citation[]) => {
  return citations && citations.length > 4;
};

export const OverallScore: React.FC<OverallScoreProps> = ({
  score,
  citations,
  search_mode,
}) => {
  const bucket = getScoreBucket(score);
  const enoughInfo = hasEnoughInformation(citations);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-2 py-0.5 text-sm font-medium rounded ${bucket.color}`}
      >
        {bucket.text}
      </span>

      {!search_mode ? (
        <span className="px-2 py-0.5 text-sm font-medium rounded bg-gray-100 text-gray-800">
          Basic Info Only
        </span>
      ) : !enoughInfo ? (
        <span className="px-2 py-0.5 text-sm font-medium rounded bg-gray-100 text-gray-800">
          Not enough information
        </span>
      ) : (
        <span className="px-2 py-0.5 text-sm font-medium rounded bg-gray-100 text-gray-800">
          {citations ? citations.length : 0} sources
        </span>
      )}
    </div>
  );
};
