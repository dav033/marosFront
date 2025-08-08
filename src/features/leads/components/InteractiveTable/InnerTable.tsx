import React, { Suspense, lazy, useMemo } from "react";
import type { InteractiveTableProps } from "../../types";
import { useLeadsData } from "../../hooks/useLeadsData";
import { useLeadModals } from "../../hooks/useLeadModals";
import { useLeadSections } from "../../hooks/useLeadSections";
import { useLeadHandlers } from "../../hooks/useLeadHandlers";
import { GenericButton } from "@components/common/GenericButton";
import { leadTableColumns } from "../LeadTableColumns";

const CreateLeadModal = lazy(() => import("../CreateLeadModal"));
const EditLeadModal   = lazy(() => import("../EditLeadModal"));
import LeadSection from "../LeadSection";

export default function InnerTable({ leadType, title, createButtonText }: InteractiveTableProps) {
  const { leads = [], projectTypes = [], contacts = [], isLoading, error, refetchLeads } = useLeadsData(leadType);
  const { modals, openCreate, closeCreate, openEdit, closeEdit } = useLeadModals();
  const sections = useLeadSections(leads);
  const { handleLeadCreated, handleLeadUpdated, handleLeadDeleted } = useLeadHandlers(refetchLeads);
  const columns = useMemo(() => leadTableColumns, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <div className="text-red-600 dark:text-red-400">
          Error loading leads: {String((error as any)?.message ?? error)}
        </div>
        <GenericButton onClick={refetchLeads}>Try Again</GenericButton>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <GenericButton className="text-sm" onClick={openCreate} disabled={isLoading}>
          {createButtonText}
        </GenericButton>
      </header>

      <Suspense fallback={
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      }>
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
