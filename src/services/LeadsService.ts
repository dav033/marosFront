import type { Lead } from "../types/types";
import { LeadType } from "src/types/enums";
import apiClient from "src/lib/apiClient";

export const LeadsService = {
  async getLeadsByType(type: LeadType): Promise<Lead[]> {
    const response = await apiClient.post(`/leads/type`, { type });
    return response.data;
  },
};
