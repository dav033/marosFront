import React, { Suspense, useEffect, useMemo, useRef } from "react";

import CreateLocalLeadModal from "./CreateLocalLeadModal";
import EditLeadModal from "./EditLeadModal";
import LeadSection from "./LeadSection";
import { useLeadsApp } from "../../di/DiProvider";
import type { LeadType } from "../../types";
import useLoading from "../context/loading/hooks/useLoading";
import { useLeadsVM } from "../hooks/useLeadsVM";
import CreateLeadModal from "../molecules/CreateLeadModal";
import { EmptyState } from "../molecules/EmptyState";
import { ErrorBanner } from "../molecules/ErrorBanner";
import { LeadHeader } from "../molecules/LeadHeader";
import { LeadsToolbar } from "../molecules/LeadsToolbar";
import { leadTableColumns } from "../molecules/LeadTableColumns";
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
  useEffect(() => {
    setSkeleton("leadsTable", { rows: 12, showSections: true }); 
  }, [setSkeleton]);
  useEffect(() => {
    if (vm.isLoading) {
      showLoading("leadsTable", { rows: 12, showSections: true }); 
    } else {
      hideLoading();
    }
    return () => {
      hideLoading();
    };
  }, [vm.isLoading, showLoading, hideLoading]);
  const prevLoadingRef = useRef<boolean>(vm.isLoading);
  useEffect(() => {
    if (vm.isLoading !== prevLoadingRef.current) {
      onLoadingChange?.(vm.isLoading);
      prevLoadingRef.current = vm.isLoading;
    }
  }, [vm.isLoading, onLoadingChange]);
  useEffect(() => {
    return () => {
      if (prevLoadingRef.current) {
        onLoadingChange?.(false);
        prevLoadingRef.current = false;
      }
    };
  }, []);

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
