import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadType } from "@/features/leads/enums";
import { LeadHttpRepository } from "@/features/leads/infra/http/LeadHttpRepository";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { Section } from "@/types";
import { buildLeadSections } from "@/features/leads/domain/services/leadSections";

const leadRepo = new LeadHttpRepository(optimizedApiClient);

/**
 * Capa fina sobre React Query (staleTime controla el cacheo a nivel de cliente).
 */
export function useLeadsByType(type: LeadType) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["leads", "byType", type],
    queryFn: () => leadRepo.findByType(type),
    staleTime: 300_000,   });

  const leads = data ?? [];
  const initialLoading = isLoading && leads.length === 0;

  const sections: Section[] = useMemo(
    () =>
      buildLeadSections(leads).map((s) => ({
        name: s.title,
        data: s.data,
      })),
    [leads]
  );

  return {
    sections,
    initialLoading,
    isFetching,
    error,
    refetch,
  };
}
