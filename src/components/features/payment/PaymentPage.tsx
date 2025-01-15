import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { PricingOptions } from "./PricingOptions";
import { paymentService } from "../../../api/payment";

export const PaymentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    try {
      setIsLoading(true);
      const checkoutUrl = await paymentService.createCheckoutSession(planId);

      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to initiate checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            <span className="text-gray-900">Preparing checkout...</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <PricingOptions onSelectPlan={handleSelectPlan} />
      </div>
    </div>
  );
};
