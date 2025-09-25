import React from "react";

import { DiProvider, useContactsApp, useLeadsApp } from "@/di/DiProvider";
import { LeadType } from "@/features/leads/enums";
import useLoading from "@/presentation/context/loading/hooks/useLoading";
import { LoadingProvider } from "@/presentation/context/loading/LoadingContext";

import { useContactsVM } from "../hooks/useContactsVM";
import { useProjectTypesVM } from "../hooks/useProjectTypesVM";
import LeadsBoard from "../organisms/LeadsBoard";

// ⬇️ Reemplazo del servicio obsoleto por VMs


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
  const { setSkeleton, showLoading, hideLoading } = useLoading();

  // ⚙️ Configuración del skeleton (sin overlay). Se mantiene igual.
  React.useEffect(() => {
     
    
    setSkeleton("leadsTable", { rows: 12, showSections: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Contextos para los VMs
  const leadsCtx = useLeadsApp();
  const contactsCtx = useContactsApp();

  // ✅ Carga de datos auxiliares con VMs (sin tocar el loading global)
  const { projectTypes = [] } = useProjectTypesVM(leadsCtx);
  const { contacts = [] } = useContactsVM(contactsCtx);

  // Señal de carga proveniente del board (mantiene comportamiento original)
  const handleLoadingChange = React.useCallback(
    (loading: boolean) => {
       
      
      if (loading) showLoading("leadsTable");
      else hideLoading();
    },
    [showLoading, hideLoading]
  );

  // Log informativo (opcional, puede quitarse)
   
  

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
  const resolvedCreateButtonText = props.createButtonText ?? fallback.createButtonText;

   
  

  return (
    <DiProvider>
      <LoadingProvider>
        <LeadsInner
          leadType={props.leadType}
          resolvedTitle={resolvedTitle}
          resolvedCreateButtonText={resolvedCreateButtonText}
        />
      </LoadingProvider>
    </DiProvider>
  );
}
