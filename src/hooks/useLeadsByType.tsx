// src/hooks/useLeadsByType.ts
import { useMemo } from "react";
import { useFetch } from "src/hooks/UseFetchResult";
import { LeadsService } from "src/services/LeadsService";
import { LeadType, LeadStatus } from "src/types/enums";
import type { Lead } from "src/types/types";

interface Section {
  title: string;
  data: Lead[];
}

export function useLeadsByType(type: LeadType) {
  const {
    data: leads = [],
    loading,
    error,
    refetch,
  } = useFetch<Lead[], [LeadType]>(LeadsService.getLeadsByType, [type]);

  const sections: Section[] = useMemo(() => {
    const safe = leads ?? [];
    return [
      {
        title: "To Do",
        data: safe.filter((l) => l.status === LeadStatus.TO_DO),
      },
      {
        title: "In Progress",
        data: safe.filter((l) => l.status === LeadStatus.IN_PROGRESS),
      },
      {
        title: "Completed",
        data: safe.filter((l) => l.status === LeadStatus.DONE),
      },
      {
        title: "Lost",
        data: safe.filter((l) => l.status === LeadStatus.LOST),
      },
    ];
  }, [leads]);

  return { sections, loading, error, refetch };
}
