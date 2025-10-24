import type { LeadType } from '@/leads';
export const leadsKeys = {
  all: ['leads'] as const,
  byType: (type: LeadType) => [...leadsKeys.all, 'byType', type] as const,
};
