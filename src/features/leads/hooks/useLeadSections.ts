import { useMemo } from "react";
import type { Lead } from "src/types/types";
import { LEAD_SECTIONS } from "../constants/leadSections";
import type { LeadSectionData } from "../types";

export function useLeadSections(leads: Lead[] = []): LeadSectionData[] {
  return useMemo(() => (
    LEAD_SECTIONS.map(({ title, status }) => ({
      title,
      status,
      data: leads.filter(lead => status === null ? !lead.status : lead.status === status),
    }))
  ), [leads]);
}
