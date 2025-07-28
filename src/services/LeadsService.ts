import type { Leads, LeadType } from "src/types/types";
import apiClient from "src/lib/apiClient";

export const LeadsService = {
  async getLeadsByType(type: LeadType): Promise<Leads[]> {
    const response = await apiClient.post(`/leads/type`, { type });
    return response.data;
  },
};
