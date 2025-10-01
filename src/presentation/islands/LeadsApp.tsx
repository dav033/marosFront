import React from "react";
import { DiProvider, useContactsApp, useLeadsApp } from "@/di/DiProvider";
import { LeadType } from "@/features/leads/enums";
import QueryProvider from "@/components/common/QueryProvider";
import TopLoader from "@/components/common/TopLoader";
import { useContacts } from "../hooks/useContact";
import { useProjectTypesVM } from "../hooks/useProjectTypesVM";
import LeadsBoard from "../organisms/LeadsBoard";
import { LoadingProvider } from "../context/loading/LoadingContext";

type Props = {
  leadType: LeadType;
  title?: string;
  createButtonText?: string;
};

const DEFAULTS: Record<LeadType, { title: string; createButtonText: string }> = {
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
  const leadsCtx = useLeadsApp();
  const contactsCtx = useContactsApp();

  const { projectTypes = [] } = useProjectTypesVM(leadsCtx);
  const { contacts = [] } = useContacts({ ctx: contactsCtx, cache: true });

  // onLoadingChange ya no controla skeleton global
  const noopLoadingChange = React.useCallback((_loading: boolean) => {}, []);

  return (
    <LoadingProvider>
      <LeadsBoard
        leadType={leadType}
        title={resolvedTitle}
        createButtonText={resolvedCreateButtonText}
        projectTypes={projectTypes}
        contacts={contacts}
      />
      <div id="modal-root" />
    </LoadingProvider>
  );
}

export default function LeadsApp(props: Props) {
  const fallback = DEFAULTS[props.leadType] ?? {
    title: "Leads",
    createButtonText: "Create Lead",
  };

  const resolvedTitle = props.title ?? fallback.title;
  const resolvedCreateButtonText = props.createButtonText ?? fallback.createButtonText;

  return (
    <QueryProvider>
      <TopLoader />
      <DiProvider>
        <LeadsInner
          leadType={props.leadType}
          resolvedTitle={resolvedTitle}
          resolvedCreateButtonText={resolvedCreateButtonText}
        />
      </DiProvider>
    </QueryProvider>
  );
}
