// src/presentation/organisms/leads/LeadsBoard.tsx
import { useLeadsApp } from "@/di/DiProvider";
import type { LeadType } from "@/features/leads/enums";
import React, { Suspense, useEffect, useMemo, useRef } from "react";
// ⚠️ Asegúrate de importar el hook correcto (ruta única en tu repo)
import { useLeadsVM } from "@/presentation/hooks/useLeadsVM";

import { EmptyState } from "@/presentation/molecules/EmptyState";
import { ErrorBanner } from "@/presentation/molecules/ErrorBanner";
import { LeadHeader } from "@/presentation/molecules/LeadHeader";
import { LeadsToolbar } from "@/presentation/molecules/LeadsToolbar";
import { leadTableColumns } from "@/presentation/molecules/LeadTableColumns";
import CreateLeadModal from "@/presentation/molecules/CreateLeadModal";

import SkeletonRenderer from "@/presentation/organisms/SkeletonRenderer";
import useLoading from "@/presentation/context/loading/hooks/useLoading";

import CreateLocalLeadModal from "./CreateLocalLeadModal";
import EditLeadModal from "./EditLeadModal";
import LeadSection from "./LeadSection";

export type LeadsBoardProps = {
  leadType: LeadType;
  title: string;
  createButtonText?: string;
  projectTypes?: Array<{ id: number; name: string; color: string }>;
  contacts?: Array<{
    id: number;
    name: string;
    companyName: string;
    email?: string;
    phone?: string;
  }>;
  /** Notifica al padre (LeadsApp) para mostrar/ocultar el skeleton */
  onLoadingChange?: (loading: boolean) => void;
};

export default function LeadsBoard({
  leadType,
  title,
  createButtonText = "Create lead",
  projectTypes = [],
  contacts = [],
  onLoadingChange,
}: LeadsBoardProps) {
  const ctx = useLeadsApp();
  const vm = useLeadsVM(ctx, leadType);
  const columns = useMemo(() => leadTableColumns, []);
  const { setSkeleton, showLoading, hideLoading } = useLoading();

  // ⚙️ Define el tipo de skeleton para LEADS (inline, sin overlay)
  useEffect(() => {
    setSkeleton("leadsTable", { rows: 12, showSections: true }); // overlay: false por defecto
  }, [setSkeleton]);

  // 🔁 Refleja el estado de carga real en el LoadingProvider (como en Contacts)
  useEffect(() => {
    if (vm.isLoading) {
      showLoading("leadsTable", { rows: 12, showSections: true }); // inline
    } else {
      hideLoading();
    }
    return () => {
      // balance en desmontaje
      hideLoading();
    };
  }, [vm.isLoading, showLoading, hideLoading]);

  // Notificar cambios de carga al contenedor (LeadsApp) si lo usas para otras cosas
  const prevLoadingRef = useRef<boolean>(vm.isLoading);
  useEffect(() => {
    if (vm.isLoading !== prevLoadingRef.current) {
      onLoadingChange?.(vm.isLoading);
      prevLoadingRef.current = vm.isLoading;
    }
  }, [vm.isLoading, onLoadingChange]);

  // Balance en unmount (modo estricto/SSR)
  useEffect(() => {
    return () => {
      if (prevLoadingRef.current) {
        onLoadingChange?.(false);
        prevLoadingRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (vm.error) return <ErrorBanner message={vm.error} />;

  // 🧱 Mientras carga: skeleton INLINE ocupando el mismo espacio que la tabla
  if (vm.isLoading) {
    return (
      <div className="space-y-8">
        <LeadHeader
          title={title}
          total={0}
          right={
            <LeadsToolbar
              onCreate={() => {}}
              onCreateLocal={() => {}}
              disabled
              createLabel={createButtonText}
            />
          }
        />
        <SkeletonRenderer />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LeadHeader
        title={title}
        total={vm.leads.length}
        right={
          <LeadsToolbar
            onCreate={vm.openCreate}
            onCreateLocal={vm.openCreateLocal}
            disabled={vm.isLoading}
            createLabel={createButtonText}
          />
        }
      />

      <Suspense fallback={null}>
        {vm.modals.isCreateOpen && (
          <CreateLeadModal
            isOpen={vm.modals.isCreateOpen}
            onClose={vm.closeCreate}
            projectTypes={projectTypes}
            contacts={contacts}
            leadType={leadType}
            onLeadCreated={(created) =>
              vm.setLeads((prev) => [created, ...prev])
            }
          />
        )}
        {vm.modals.isCreateLocalOpen && (
          <CreateLocalLeadModal
            isOpen={vm.modals.isCreateLocalOpen}
            onClose={vm.closeCreateLocal}
            projectTypes={projectTypes}
            contacts={contacts}
            leadType={leadType}
            onLeadCreated={(created) =>
              vm.setLeads((prev) => [created, ...prev])
            }
          />
        )}
        {vm.modals.isEditOpen && vm.modals.editingLead && (
          <EditLeadModal
            isOpen={vm.modals.isEditOpen}
            onClose={vm.closeEdit}
            lead={vm.modals.editingLead}
            projectTypes={projectTypes}
            contacts={contacts}
            onLeadUpdated={(lead) => vm.onLeadUpdated(lead)}
          />
        )}
      </Suspense>

      <div className="space-y-6">
        {vm.sections.map(({ title: secTitle, data, status }) => (
          <LeadSection
            key={`${secTitle}-${status ?? "none"}`}
            title={secTitle}
            data={data}
            columns={columns}
            onEditLead={vm.openEdit}
            // ⬇️ LeadSection espera (lead: Lead) => void; adaptamos a id y manejamos async
            onDeleteLead={async (lead) => await vm.onLeadDeleted(lead.id)}
          />
        ))}
      </div>

      {vm.leads.length === 0 && (
        <EmptyState
          title={title}
          onCreate={vm.openCreate}
          onCreateLocal={vm.openCreateLocal}
        />
      )}
    </div>
  );
}
