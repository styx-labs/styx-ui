import React from "react";
import { Citation } from "../../../../types";

interface OverallScoreProps {
  citations?: Citation[];
  search_mode?: boolean;
}

const hasEnoughInformation = (citations?: Citation[]) => {
  return citations && citations.length > 4;
};

export const OverallScore: React.FC<OverallScoreProps> = ({
  citations,
  search_mode,
}) => {
  const enoughInfo = hasEnoughInformation(citations);

  return (
    <div className="flex items-center gap-2">
      {!search_mode ? (
        <span className="px-2 py-0.5 text-sm font-medium rounded bg-gray-100 text-gray-800">
          Non-Search Mode
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
