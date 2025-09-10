import { useMemo } from "react";
import { OptimizedLeadsService } from "../services/OptimizedLeadsService";
import { LeadType, LeadStatus } from "src/types/enums";
import type { Lead, Section, Undetermined } from "src/types";
import { useOptimizedFetch } from "./useOptimizedFetch";

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
    OptimizedLeadsService.getLeadsByType,
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
