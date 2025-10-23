import type { LeadType } from "@/types";

export const leadsKeys = {
  all: ['leads'] as const,
  byType: (type: LeadType) => [...leadsKeys.all, 'byType', type] as const,
};
