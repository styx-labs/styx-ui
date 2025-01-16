import { apiService } from "./index";

export const paymentService = {
  async createCheckoutSession(planId: string): Promise<string> {
    const response = await apiService.getCheckoutSession(planId);
    return response.data.url;
  },
};
