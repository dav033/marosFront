import React, { Suspense, lazy, useMemo, useEffect, useState } from "react";
import { useLeadsData } from "src/features/leads/hooks/useLeadsData";
import { useLeadModals } from "src/features/leads/hooks/useLeadModals";
import { useLeadSections } from "src/features/leads/hooks/useLeadSections";
import { useLeadHandlers } from "src/features/leads/hooks/useLeadHandlers";
import { GenericButton } from "@components/common/GenericButton";
import { leadTableColumns } from "src/features/leads/components/LeadTableColumns";

const loadCreateLeadModal = () => import("../CreateLeadModal");
const loadEditLeadModal = () => import("../../../../components/leads/EditLeadModal.tsx");
const loadCreateLocalLeadModal = () => import("../CreateLocalLeadModal");
const CreateLeadModal = lazy(loadCreateLeadModal);
const EditLeadModal = lazy(loadEditLeadModal);
const CreateLocalLeadModal = lazy(loadCreateLocalLeadModal);

import LeadSection from "../LeadSection";
import type { InteractiveTableProps } from "@/types/domain.ts";

export default function InnerTable({
  leadType,
  title,
  createButtonText,
}: InteractiveTableProps) {
  // Estado para manejar hidratación
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadCreateLeadModal();
    loadEditLeadModal();
  }, []);
  const {
    leads = [],
    projectTypes = [],
    contacts = [],
    isLoading,
    error,
    showSkeleton,
    addLead,
    updateLead,
    removeLead,
  } = useLeadsData(leadType);
  const { modals, openCreate, closeCreate, openCreateLocal, closeCreateLocal, openEdit, closeEdit } =
    useLeadModals();
  const sections = useLeadSections(leads);
  const { handleLeadDeleted } = useLeadHandlers({
    onDeleted: removeLead,
    onUpdated: updateLead,
    onCreated: addLead, // optional, can be omitted if not needed
  });
  const columns = useMemo(() => leadTableColumns, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <div className="text-red-600 dark:text-red-400">
          Error loading leads: {typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : String(error)}
        </div>
      </div>
    );
  }

  // Mostrar skeleton o loading mientras no esté hidratado o cargando
  if (!isClient || showSkeleton || isLoading) return null;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GenericButton
            className="text-sm"
            onClick={openCreate}
            disabled={isLoading}
          >
            {createButtonText}
          </GenericButton>
          <GenericButton
            className="text-sm"
            onClick={openCreateLocal}
            disabled={isLoading}
          >
            Create lead locally (don’t sync to ClickUp)
          </GenericButton>
        </div>
      </header>

  <Suspense fallback={null}>
    {modals.isCreateOpen && (
      <CreateLeadModal
        isOpen={modals.isCreateOpen}
        onClose={closeCreate}
        projectTypes={projectTypes}
        contacts={contacts}
        leadType={leadType}
        onLeadCreated={addLead} // Mutación local tras respuesta del API
      />
    )}

    {modals.isCreateLocalOpen && (
      <CreateLocalLeadModal
        isOpen={modals.isCreateLocalOpen}
        onClose={closeCreateLocal}
        projectTypes={projectTypes}
        contacts={contacts}
        leadType={leadType}
        onLeadCreated={addLead}
      />
    )}

    {modals.isEditOpen && modals.editingLead && (
      <EditLeadModal
        isOpen={modals.isEditOpen}
        onClose={closeEdit}
        lead={modals.editingLead}
        projectTypes={projectTypes}
        contacts={contacts}
        onLeadUpdated={updateLead}
      />
    )}
  </Suspense>

      <div className="space-y-6">
        {sections.map(({ title: secTitle, data, status }) => (
          <LeadSection
            key={`${secTitle}-${status}`}
            title={secTitle}
            data={data}
            columns={columns}
            onEditLead={openEdit}
            onDeleteLead={handleLeadDeleted}
          />
        ))}
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            No {title.toLowerCase()} found
          </div>
          <GenericButton onClick={openCreate}>
            Create your first {title.toLowerCase().slice(0, -1)}
          </GenericButton>
          <div className="mt-2">
            <GenericButton onClick={openCreateLocal}>
              Create lead locally (don’t sync to ClickUp)
            </GenericButton>
          </div>
        </div>
      )}
    </div>
  );
}
