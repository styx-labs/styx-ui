import React from "react";
import { Step } from "../types";

interface ProgressBarProps {
  currentStep: number;
  steps: readonly Step[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep > index + 1
                  ? "bg-green-500 text-white"
                  : currentStep === index + 1
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > index + 1 ? "✓" : index + 1}
            </div>
            <span className="mt-2 text-xs text-gray-500">{step}</span>
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${(currentStep - 1) * 50}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  );
};
