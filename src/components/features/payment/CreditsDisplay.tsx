import React from "react";
import { Coins } from "lucide-react";

interface CreditsDisplayProps {
  credits: number;
  onOpenPricing: () => void;
}

export const CreditsDisplay: React.FC<CreditsDisplayProps> = ({
  credits,
  onOpenPricing,
}) => {
  return (
    <button
      onClick={onOpenPricing}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
    >
      <Coins className="w-4 h-4 text-purple-500" />
      <span>{credits.toLocaleString()} credits</span>
    </button>
  );
};
