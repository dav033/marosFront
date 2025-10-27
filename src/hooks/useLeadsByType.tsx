import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { useLeadsApp } from "@/di";
import type { Lead, LeadType } from "@/leads";
import { buildLeadSections, leadsKeys,listLeadsByType } from "@/leads";

type UiSection = Readonly<{
  name: string;
  data: Lead[];
}>;

export function useLeadsByType(type: LeadType) {
  const ctx = useLeadsApp();

  const q = useQuery<Lead[], Error>({
    queryKey: leadsKeys.byType(type),
    queryFn: () => listLeadsByType(ctx, type),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const sections: UiSection[] = React.useMemo(() => {
    const base = buildLeadSections(q.data ?? []);
    return base.map((s) => ({ name: s.title, data: s.data }));
  }, [q.data]);

  return {
    sections,
    initialLoading: q.isLoading,
    isFetching: q.isFetching,
    error: q.error,
    refetch: q.refetch,
  } as const;
}
