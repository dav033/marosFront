// Capa: Presentation — Hook principal (sin resolver repos; usa el use case)
import * as React from "react";

import type { LeadsAppContext } from "@/features/leads/application/context";
import { fetchLeadsByType } from "@/features/leads/application/usecases/queries/fetchLeadsByType";
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadType } from "@/features/leads/enums";
import { buildLeadSections } from "@/presentation/features/leads/vm/buildLeadSections";
import type {
  LeadSection,
  LeadsVM,
} from "@/presentation/features/leads/vm/types";
import { getErrorMessage } from "@/utils/errors";
import { deleteLead as deleteLeadUseCase } from "@/features/leads/application";

export function useLeadsVM(ctx: LeadsAppContext, leadType: LeadType): LeadsVM {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [sections, setSections] = React.useState<LeadSection[]>([
    { title: "All", data: [] },
  ]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await fetchLeadsByType(ctx, leadType);
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

  // Modales
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isCreateLocalOpen, setIsCreateLocalOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);

  const openCreate = React.useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = React.useCallback(() => setIsCreateOpen(false), []);
  const openCreateLocal = React.useCallback(
    () => setIsCreateLocalOpen(true),
    []
  );
  const closeCreateLocal = React.useCallback(
    () => setIsCreateLocalOpen(false),
    []
  );
  const openEdit = React.useCallback((lead: Lead) => {
    setEditingLead(lead);
    setIsEditOpen(true);
  }, []);
  const closeEdit = React.useCallback(() => {
    setIsEditOpen(false);
    setEditingLead(null);
  }, []);

  // Sincronización local
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
        // Ejecutar el caso de uso que invoca al repositorio (DELETE HTTP)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await deleteLeadUseCase((ctx as any) as LeadsAppContext, leadId as any);

        // Actualizar estado local solo tras éxito remoto
        setLeads((prev) => {
          const next = prev.filter((l) => l.id !== leadId);
          setSections(buildLeadSections(next));
          return next;
        });
      } catch (e: unknown) {
        const msg = getErrorMessage(e) || "Failed to delete lead";
        // eslint-disable-next-line no-console
        console.error("deleteLead failed:", msg, e);
        throw e;
      }
    },
    [ctx]
  );

  return {
    leads,
    sections,
    error,
    isLoading,
    refetch: load,
    setLeads,
    modals: {
      isCreateOpen,
      isCreateLocalOpen,
      isEditOpen,
      editingLead,
    },
    openCreate,
    closeCreate,
    openCreateLocal,
    closeCreateLocal,
    openEdit,
    closeEdit,
  onLeadUpdated,
  onLeadDeleted,
  };
}
