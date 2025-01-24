import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { paymentService } from "../api/payment";

export const usePricing = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = useCallback(async (planId: string) => {
    try {
      setIsLoading(true);
      const checkoutUrl = await paymentService.createCheckoutSession(planId);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to initiate checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    handleSelectPlan,
  };
};
