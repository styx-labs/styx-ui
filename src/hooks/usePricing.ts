import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { paymentService } from "../api/payment";

export const usePricing = () => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openPricing = useCallback(() => {
    setIsPricingOpen(true);
  }, []);

  const closePricing = useCallback(() => {
    setIsPricingOpen(false);
  }, []);

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
    isPricingOpen,
    isLoading,
    openPricing,
    closePricing,
    handleSelectPlan,
  };
};
