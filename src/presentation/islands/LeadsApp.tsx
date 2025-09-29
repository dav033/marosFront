import React from "react";

import { DiProvider, useContactsApp, useLeadsApp } from "@/di/DiProvider";
import { LeadType } from "@/features/leads/enums";
import useLoading from "@/presentation/context/loading/hooks/useLoading";
import { LoadingProvider } from "@/presentation/context/loading/LoadingContext";

import { useProjectTypesVM } from "../hooks/useProjectTypesVM";
import LeadsBoard from "../organisms/LeadsBoard";
import QueryProvider from "@/components/common/QueryProvider";
import { useContacts } from "../hooks/useContact";

type Props = {
  leadType: LeadType;
  title?: string;
  createButtonText?: string;
};

const DEFAULTS: Record<LeadType, { title: string; createButtonText: string }> =
  {
    [LeadType.CONSTRUCTION]: {
      title: "Construction Leads",
      createButtonText: "Create Construction Lead",
    },
    [LeadType.PLUMBING]: {
      title: "Plumbing Leads",
      createButtonText: "Create Plumbing Lead",
    },
    [LeadType.ROOFING]: {
      title: "Roofing Leads",
      createButtonText: "Create Roofing Lead",
    },
  };

function LeadsInner({
  leadType,
  resolvedTitle,
  resolvedCreateButtonText,
}: {
  leadType: LeadType;
  resolvedTitle: string;
  resolvedCreateButtonText: string;
}) {
  const { setSkeleton, showLoading, hideLoading } = useLoading();
  React.useEffect(() => {
    setSkeleton("leadsTable", { rows: 12, showSections: true });
  }, []);
  const leadsCtx = useLeadsApp();
  const contactsCtx = useContactsApp();
  const { projectTypes = [] } = useProjectTypesVM(leadsCtx);
  const { contacts = [] } = useContacts({
    ctx: contactsCtx,
    cache: true,
  });
  const handleLoadingChange = React.useCallback(
    (loading: boolean) => {
      if (loading) showLoading("leadsTable");
      else hideLoading();
    },
    [showLoading, hideLoading]
  );

  return (
    <>
      <LeadsBoard
        leadType={leadType}
        title={resolvedTitle}
        createButtonText={resolvedCreateButtonText}
        projectTypes={projectTypes}
        contacts={contacts}
        onLoadingChange={handleLoadingChange}
      />
      <div id="modal-root" />
    </>
  );
}

export default function LeadsApp(props: Props) {
  const fallback = DEFAULTS[props.leadType] ?? {
    title: "Leads",
    createButtonText: "Create Lead",
  };

  const resolvedTitle = props.title ?? fallback.title;
  const resolvedCreateButtonText =
    props.createButtonText ?? fallback.createButtonText;

  return (
    <QueryProvider>
      <DiProvider>
        <LoadingProvider>
          <LeadsInner
            leadType={props.leadType}
            resolvedTitle={resolvedTitle}
            resolvedCreateButtonText={resolvedCreateButtonText}
          />
        </LoadingProvider>
      </DiProvider>
    </QueryProvider>
  );
}
