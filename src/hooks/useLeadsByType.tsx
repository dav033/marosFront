import { useMemo } from "react";

import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadType } from "@/features/leads/enums";
import { LeadHttpRepository } from "@/features/leads/infra/http/LeadHttpRepository";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { Section } from "@/types";

import { useOptimizedFetch } from "./useOptimizedFetch";
// ⬇️ nuevo: servicio unificado
import { buildLeadSections } from "@/features/leads/domain/services/leadSections";

const leadRepo = new LeadHttpRepository(optimizedApiClient);

export function useLeadsByType(type: LeadType) {
  const {
    data: leads = [],
    loading,
    error,
    refetch,
    fromCache,
  } = useOptimizedFetch<Lead[], [LeadType]>(
    (t: LeadType) => leadRepo.findByType(t),
    [type],
    { cacheKey: `leads-by-type-${type}`, ttl: 300_000 }
  );

  const initialLoading = loading && !fromCache && leads?.length === 0;

  // Adaptamos LeadSection (domain) → Section (UI genérica { name, data })
  const sections: Section[] = useMemo(() => {
    return buildLeadSections(leads ?? []).map((s) => ({
      name: s.title,
      data: s.data,
    }));
  }, [leads]);

  return {
    sections,
    initialLoading,
    isFetching: loading,
    error,
    refetch,
  };
}
