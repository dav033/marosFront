import type { LeadType } from "@/types/enums";

export const leadsKeys = {
  all: ['leads'] as const,
  byType: (type: LeadType) => [...leadsKeys.all, 'byType', type] as const,
};
