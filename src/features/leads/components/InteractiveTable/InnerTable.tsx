import React, { Suspense, lazy, useMemo } from "react";
import type { InteractiveTableProps } from "src/features/leads/types";
import { useLeadsData } from "src/features/leads/hooks/useLeadsData";
import { useLeadModals } from "src/features/leads/hooks/useLeadModals";
import { useLeadSections } from "src/features/leads/hooks/useLeadSections";
import { useLeadHandlers } from "src/features/leads/hooks/useLeadHandlers";
import { GenericButton } from "@components/common/GenericButton";
import { leadTableColumns } from "src/features/leads/components/LeadTableColumns";

const loadCreateLeadModal = () => import("../CreateLeadModal");
const loadEditLeadModal = () => import("../EditLeadModal");
const CreateLeadModal = lazy(loadCreateLeadModal);
const EditLeadModal = lazy(loadEditLeadModal);

import { useEffect } from "react";
import LeadSection from "../LeadSection";

export default function InnerTable({
  leadType,
  title,
  createButtonText,
}: InteractiveTableProps) {
  useEffect(() => {
    loadCreateLeadModal();
    loadEditLeadModal();
  }, []);
  const {
    leads = [],
    projectTypes = [],
    contacts = [],
    isLoading,
    error,
    refetchLeads,
    showSkeleton,
  } = useLeadsData(leadType);
  const { modals, openCreate, closeCreate, openEdit, closeEdit } =
    useLeadModals();
  const sections = useLeadSections(leads);
  const { handleLeadCreated, handleLeadUpdated, handleLeadDeleted } =
    useLeadHandlers(refetchLeads);
  const columns = useMemo(() => leadTableColumns, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <div className="text-red-600 dark:text-red-400">
          Error loading leads: {typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : String(error)}
        </div>
        <GenericButton onClick={refetchLeads}>Try Again</GenericButton>
      </div>
    );
  }

  if (showSkeleton || isLoading) return null;

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
        <GenericButton
          className="text-sm"
          onClick={openCreate}
          disabled={isLoading}
        >
          {createButtonText}
        </GenericButton>
      </header>

  <Suspense fallback={null}>
        {modals.isCreateOpen && (
          <CreateLeadModal
            isOpen={modals.isCreateOpen}
            onClose={closeCreate}
            projectTypes={projectTypes}
            contacts={contacts}
            leadType={leadType}
            onLeadCreated={handleLeadCreated}
          />
        )}

        {modals.isEditOpen && modals.editingLead && (
          <EditLeadModal
            isOpen={modals.isEditOpen}
            onClose={closeEdit}
            lead={modals.editingLead}
            projectTypes={projectTypes}
            contacts={contacts}
            onLeadUpdated={handleLeadUpdated}
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
        </div>
      )}
    </div>
  );
}
