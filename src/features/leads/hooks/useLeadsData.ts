import { useEffect } from "react";
import { useInstantList } from "src/hooks/useInstantData";
import { OptimizedContactsService } from "src/services/OptimizedContactsService";
import { ProjectTypeService } from "src/services/ProjectTypeService";
import { useLoading } from "src/contexts/LoadingContext";
import type { LeadType } from "src/types/enums";
import { OptimizedLeadsService } from "src/services/OptimizedLeadsService";

export function useLeadsData(leadType: LeadType) {
  const {
    items: leads = [],
    loading: isLoading,
    showSkeleton,
    refresh: refetchLeads,
    error,
  } = useInstantList(
    `leads_${leadType}`,
    () => OptimizedLeadsService.getLeadsByType(leadType),
    { ttl: 300000, showSkeletonOnlyOnFirstLoad: true }
  );

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
  useEffect(() => { setSkeleton("leadsTable", { rows: 8, showSections: true }); }, [setSkeleton]);
  useEffect(() => {
    if (showSkeleton || isLoading) {
      showLoading("leadsTable", { rows: 8, showSections: true });
    } else { hideLoading(); }
    return () => { hideLoading(); };
  }, [showSkeleton, isLoading, showLoading, hideLoading]);

  return { leads, projectTypes, contacts, isLoading, error, refetchLeads, showSkeleton };
}
