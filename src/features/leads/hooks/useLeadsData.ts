import { useCallback, useEffect } from "react";
import { useInstantList } from "../../../hooks/useInstantData.tsx";
import type { Lead } from "src/types/domain";
import { OptimizedContactsService } from "src/services/OptimizedContactsService";
import { ProjectTypeService } from "src/services/ProjectTypeService";
import { useLoading } from "src/contexts/LoadingContext";
import type { LeadType } from "src/types/enums";
import { OptimizedLeadsService } from "../../../services/OptimizedLeadsService";

export function useLeadsData(leadType: LeadType) {
  const {
    items: leads = [],
    loading: isLoading,
    showSkeleton,
    refresh: refetchLeads,
    error,
    mutateItems,
  } = useInstantList<Lead>(
    `leads_${leadType}`,
    () => OptimizedLeadsService.getLeadsByType(leadType),
    { ttl: 300000, showSkeletonOnlyOnFirstLoad: true }
  );
  // Ajuste esta condición a su segmentación real (por leadType, status, etc.)
  const matchesCurrentList = (lead: Lead) => {
    return lead.leadType === leadType;
  };

  // fallback para mutateItems si es undefined
  const safeMutate = mutateItems ?? (() => {});

  const addLead = (created: Lead) => {
    safeMutate((prev: Lead[]) => {
      const list = Array.isArray(prev) ? prev : [];
      if (!created) return list;
      if (!matchesCurrentList(created)) return list;
      if (list.some((l) => l.id === created.id)) return list;
      return [created, ...list];
    });
  };

  const updateLead = useCallback((updated: Lead) => {
    safeMutate((prev: Lead[]) => {
      const list = Array.isArray(prev) ? prev : [];
      const exists = list.some((l) => l.id === updated.id);
      // si ya no pertenece a esta vista, sáquelo
      if (!matchesCurrentList(updated)) {
        return exists ? list.filter((l) => l.id !== updated.id) : list;
      }
      // si existe, reemplazar; si no, insertarlo (por si el update lo trae a esta vista)
      return exists ? list.map((l) => (l.id === updated.id ? updated : l)) : [updated, ...list];
    });
  }, [safeMutate, matchesCurrentList]);

  const removeLead = (id: number) => {
    safeMutate((prev: Lead[]) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.filter((l) => l.id !== id);
    });
  };

  const { items: projectTypes = [] } = useInstantList(
    "project_types",
    ProjectTypeService.getProjectTypes,
    { ttl: 600000 }
  );

  const { items: contacts = [] } = useInstantList(
    "contacts",
    OptimizedContactsService.getAllContacts,
    { ttl: 300000 }
  );

  // Loading skeleton centralizado
  const { showLoading, hideLoading, setSkeleton } = useLoading();
  useEffect(() => {
    setSkeleton("leadsTable", { rows: 8, showSections: true });
  }, [setSkeleton]);
  useEffect(() => {
    if (showSkeleton || isLoading) {
      showLoading("leadsTable", { rows: 8, showSections: true });
    } else {
      hideLoading();
    }
    return () => {
      hideLoading();
    };
  }, [showSkeleton, isLoading, showLoading, hideLoading]);

  return {
    leads,
    projectTypes,
    contacts,
    isLoading,
    error,
    refetchLeads,
    showSkeleton,
    addLead,
    updateLead,
    removeLead,
  };
}
