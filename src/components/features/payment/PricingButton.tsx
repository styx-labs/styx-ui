import React from "react";
import { CreditCard } from "lucide-react";

interface PricingButtonProps {
  onOpenPricing: () => void;
}

export const PricingButton: React.FC<PricingButtonProps> = ({
  onOpenPricing,
}) => {
  return (
    <button
      onClick={onOpenPricing}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
    >
      <CreditCard className="w-4 h-4" />
      <span>Pricing</span>
    </button>
  );
};
