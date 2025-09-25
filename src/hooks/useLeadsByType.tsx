import { useMemo } from "react";

import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadType } from "@/features/leads/enums";
import { LeadStatus } from "@/features/leads/enums";
import { LeadHttpRepository } from "@/features/leads/infra/http/LeadHttpRepository";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { Section } from "@/types";
import type { Undetermined } from "@/types/hooks/optimized-fetch";

import { useOptimizedFetch } from "./useOptimizedFetch";

const leadRepo = new LeadHttpRepository(optimizedApiClient);

type BucketKey = LeadStatus | Undetermined;

const SECTION_ORDER: { key: BucketKey; title: string }[] = [
  { key: LeadStatus.NEW,         title: "New" },
  { key: "UNDETERMINED",         title: "Undetermined" },
  { key: LeadStatus.TO_DO,       title: "To Do" },
  { key: LeadStatus.IN_PROGRESS, title: "In Progress" },
  { key: LeadStatus.DONE,        title: "Completed" },
  { key: LeadStatus.LOST,        title: "Lost" },
];

export function useLeadsByType(type: LeadType) {
  const {
    data: leads = [],
    loading,
    error,
    refetch,
    fromCache, // para distinguir carga inicial real vs revalidación en background
  } = useOptimizedFetch<Lead[], [LeadType]>(
    (type: LeadType) => leadRepo.findByType(type),
    [type],
    {
      cacheKey: `leads-by-type-${type}`,
      ttl: 300_000,
      // storage, showSkeletonOnlyOnFirstLoad y backgroundRefreshThreshold ya tienen defaults adecuados
      // refetchInterval no se necesita, omitir mantiene el comportamiento actual
    }
  );

  // Solo mostramos "cargando inicial" si no viene de caché y aún no hay datos
  const initialLoading = loading && !fromCache && (leads?.length === 0);

  const sections: Section[] = useMemo(() => {
    // Agrupación en una pasada
    const buckets: Record<BucketKey, Lead[]> = {
      [LeadStatus.NEW]: [],
      UNDETERMINED: [],
      [LeadStatus.TO_DO]: [],
      [LeadStatus.IN_PROGRESS]: [],
      [LeadStatus.DONE]: [],
      [LeadStatus.LOST]: [],
      [LeadStatus.NOT_EXECUTED]: []
    };

    for (const lead of leads ?? []) {
      const status = (lead.status ?? "UNDETERMINED") as BucketKey;
      (buckets[status] ?? buckets.UNDETERMINED).push(lead);
    }

    // Construimos las secciones en el orden deseado
    return SECTION_ORDER.map(({ key, title }) => ({
      name: title,
      data: buckets[key],
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
