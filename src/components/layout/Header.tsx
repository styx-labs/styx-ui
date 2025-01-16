import React from "react";
import { UserMenu } from "./UserMenu";
import { CreditsDisplay } from "../features/payment/CreditsDisplay";
import { PricingModal } from "../features/payment/PricingModal";
import { usePricing } from "../../hooks/usePricing";

interface HeaderProps {
  onLogout: () => void;
  userEmail: string;
  credits: number;
}

export const Header: React.FC<HeaderProps> = ({
  onLogout,
  userEmail,
  credits,
}) => {
  const {
    isPricingOpen,
    isLoading,
    openPricing,
    closePricing,
    handleSelectPlan,
  } = usePricing();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Styx</h1>
          </div>

          <div className="flex items-center gap-4">
            <CreditsDisplay credits={credits} onOpenPricing={openPricing} />
            <UserMenu
              onLogout={onLogout}
              onOpenPricing={openPricing}
              userEmail={userEmail}
            />
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={isPricingOpen}
        onClose={closePricing}
        onSelectPlan={handleSelectPlan}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
            <span className="text-gray-900">Preparing checkout...</span>
          </div>
        </div>
      )}
    </header>
  );
};
