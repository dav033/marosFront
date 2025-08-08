import { useMemo } from "react";
import type { Lead } from "src/types";
import { LEAD_SECTIONS } from "src/features/leads/constants/leadSections";
import type { LeadSectionData } from "src/features/leads/types";

export function useLeadSections(leads: Lead[] = []): LeadSectionData[] {
  return useMemo(
    () =>
      LEAD_SECTIONS.map(({ title, status }) => ({
        title,
        status,
        data: leads.filter((lead) =>
          status === null ? !lead.status : lead.status === status
        ),
      })),
    [leads]
  );
}
