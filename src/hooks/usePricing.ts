import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "../api/payment";

export const usePricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleSelectPlan = useCallback(async (planId: string) => {
    try {
      setIsLoading(true);
      const checkoutUrl = await paymentService.createCheckoutSession(planId);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    handleSelectPlan,
  };
};
