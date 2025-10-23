import React, { Suspense, useMemo } from "react";

import { useLeadsApp } from "@/di";
import { useLeadsVM } from "@/presentation";
import {
  CreateLeadModal,
  CreateLocalLeadModal,
  EditLeadModal,
  EmptyState,
  ErrorBanner,
  LeadHeader,
  LeadSection,
  LeadsToolbar,
  leadTableColumns,
} from "@/presentation";
import type { LeadType } from "@/types";

import SkeletonRenderer from "./SkeletonRenderer";

export type LeadsBoardProps = {
  leadType: LeadType;
  title: string;
  createButtonText?: string;
  projectTypes?: Array<{ id: number; name: string; color: string }>;
  contacts?: Array<{
    id: number;
    name: string;
    companyName: string;
    email?: string | undefined;
    phone?: string | undefined;
  }>;
};

export default function LeadsBoard({
  leadType,
  title,
  createButtonText = "Create lead",
  projectTypes = [],
  contacts = [],
}: LeadsBoardProps) {
  const ctx = useLeadsApp();
  const vm = useLeadsVM(ctx, leadType);
  const columns = useMemo(() => leadTableColumns, []);

  if (vm.error) return <ErrorBanner message={vm.error} />;

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
        <SkeletonRenderer type="leadsTable" rows={12} showSections loading={vm.isLoading} />
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
              vm.setLeads((prev: any) => [created, ...prev])
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
            onLeadCreated={(created: any) =>
              vm.setLeads((prev: any) => [created, ...prev])
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
        {vm.sections.map(
          ({
            title: secTitle,
            data,
            status,
          }: {
            title: string;
            data: any[];
            status?: string;
          }) => (
            <LeadSection
              key={`${secTitle}-${status ?? "none"}`}
              title={secTitle}
              data={data}
              columns={columns}
              onEditLead={vm.openEdit}
              onDeleteLead={async (lead) => await vm.onLeadDeleted(lead.id)}
            />
          )
        )}
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
