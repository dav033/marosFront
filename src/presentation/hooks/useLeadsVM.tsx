import React from "react";

import type { LeadsAppContext } from "@/leads";
import type { Lead, LeadSection,LeadType } from "@/leads";
import { buildLeadSections, deleteLead as deleteLeadUseCase, listLeadsByType } from "@/leads";
import { getErrorMessage } from "@/utils";

export function useLeadsVM(ctx: LeadsAppContext, leadType: LeadType) {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [sections, setSections] = React.useState<LeadSection[]>([
    { title: "All", data: [] },
  ]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await listLeadsByType(ctx, leadType);
      setLeads(items);
      setSections(buildLeadSections(items));
      setError(null);
    } catch (e: unknown) {
      const msg = getErrorMessage(e) || "Failed to load leads";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [ctx, leadType]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isCreateLocalOpen, setIsCreateLocalOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);

  const openCreate = React.useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = React.useCallback(() => setIsCreateOpen(false), []);
  const openCreateLocal = React.useCallback(() => setIsCreateLocalOpen(true), []);
  const closeCreateLocal = React.useCallback(() => setIsCreateLocalOpen(false), []);
  const openEdit = React.useCallback((lead: Lead) => {
    setEditingLead(lead);
    setIsEditOpen(true);
  }, []);
  const closeEdit = React.useCallback(() => {
    setIsEditOpen(false);
    setEditingLead(null);
  }, []);

  
  const onLeadCreated = React.useCallback((created: Lead) => {
    setLeads((prev) => {
      const next = [created, ...prev];
      setSections(buildLeadSections(next));
      return next;
    });
  }, []);

  const onLeadUpdated = React.useCallback((lead: Lead) => {
    setLeads((prev) => {
      const next = prev.map((l) => (l.id === lead.id ? lead : l));
      setSections(buildLeadSections(next));
      return next;
    });
  }, []);

  const onLeadDeleted = React.useCallback(
    async (leadId: Lead["id"]) => {
      try {
        await deleteLeadUseCase(ctx as any as LeadsAppContext, leadId as any);
        setLeads((prev) => {
          const next = prev.filter((l) => l.id !== leadId);
          setSections(buildLeadSections(next));
          return next;
        });
      } catch {
        
      }
    },
    [ctx]
  );

  return {
    leads,
    sections,
    error,
    isLoading,
    modals: {
      isCreateOpen,
      isCreateLocalOpen,
      isEditOpen,
      editingLead,
    },
    refetch: load,
    setLeads,         
    openCreate,
    closeCreate,
    openCreateLocal,
    closeCreateLocal,
    openEdit,
    closeEdit,
    onLeadCreated,    
    onLeadUpdated,
    onLeadDeleted,
  };
}
