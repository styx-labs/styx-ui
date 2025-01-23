import React from "react";
import { AlertCircle } from "lucide-react";

export const TraitTips: React.FC = () => {
  return (
    <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-800 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium mb-1">Tips for better evaluations:</p>
        <ul className="list-disc list-inside space-y-1 text-purple-700">
          <li>Use clear, specific trait names</li>
          <li>Add detailed descriptions to guide the evaluation</li>
          <li>Focus on traits that are most important for the role</li>
          <li>Mark critical requirements as "Required"</li>
        </ul>
      </div>
    </div>
  );
};
