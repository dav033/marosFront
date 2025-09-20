// src/presentation/islands/LeadsApp.tsx
import React from "react";
import { DiProvider } from "@/di/DiProvider";
import { LeadType } from "@/features/leads/enums";

import { LoadingProvider } from "@/presentation/context/loading/LoadingContext";
import useLoading from "@/presentation/context/loading/hooks/useLoading";
import LeadsBoard from "../organisms/LeadsBoard";
import { useInstantList } from "@/hooks/useInstantData";
import { OptimizedLeadsService } from "@/services/OptimizedLeadsService";

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

  // 🔥 AGREGAR LOS DATOS QUE ESTABAN FALTANDO
  console.log('🔍 LeadsInner: Loading project types and contacts...');
  
  const { items: projectTypes = [] } = useInstantList(
    "project_types",
    OptimizedLeadsService.getProjectTypes,
    { ttl: 600000 }
  );

  const { items: contacts = [] } = useInstantList(
    "contacts",
    OptimizedLeadsService.getContacts,
    { ttl: 300000 }
  );

  console.log('📊 LeadsInner data loaded:', {
    projectTypesCount: projectTypes.length,
    contactsCount: contacts.length
  });

  // ⚙️ Configura el tipo de skeleton: SIN overlay
  React.useEffect(() => {
    console.log("[LeadsApp] setSkeleton -> leadsTable (inline)");
    setSkeleton("leadsTable", { rows: 12, showSections: true }); // ← sin overlay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recibe del board la señal de carga real y la refleja en el contexto
  const handleLoadingChange = React.useCallback(
    (loading: boolean) => {
      console.log("[LeadsApp] onLoadingChange:", loading);
      if (loading) showLoading("leadsTable"); // usa las opciones ya configuradas (inline)
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
      {/* Si usas portales para modales, mantenlos dentro del Provider */}
      <div id="modal-root" />
      {/* ⬇️ OJO: ya NO renderizamos SkeletonRenderer aquí; se muestra dentro del Board. */}
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

  console.log("[LeadsApp] render ", { leadType: props.leadType, resolvedTitle });

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
