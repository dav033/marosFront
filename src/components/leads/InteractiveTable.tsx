import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { LeadType, LeadStatus } from "src/types/enums";
import { OptimizedLeadsService } from "src/services/OptimizedLeadsService";
import { OptimizedContactsService } from "src/services/OptimizedContactsService";
import { leadTableColumns } from "./LeadTableColumns";
import LeadSection from "./LeadSection";
import { GenericButton } from "@components/common/GenericButton";
import { useInstantList } from "src/hooks/useInstantData";
import { ProjectTypeService } from "src/services/ProjectTypeService";
import type { Lead } from "src/types/types";
import { deleteLead } from "../../utils/leadHelpers";
import { LoadingProvider, useLoading } from "src/contexts/LoadingContext";
import { SkeletonRenderer } from "@components/common/SkeletonRenderer";

// Lazy load modals
const CreateLeadModal = lazy(() => import("./CreateLeadModal"));
const EditLeadModal = lazy(() => import("./EditLeadModal"));

// Tipos mejorados
interface InteractiveTableProps {
  leadType: LeadType;
  title: string;
  createButtonText: string;
}

interface LeadSectionData {
  title: string;
  status: LeadStatus | null;
  data: Lead[];
}

// Constantes para evitar recrear arrays
const LEAD_SECTIONS: Array<{ title: string; status: LeadStatus | null }> = [
  { title: "Pending", status: LeadStatus.TO_DO },
  { title: "In Progress", status: LeadStatus.IN_PROGRESS },
  { title: "Completed", status: LeadStatus.DONE },
  { title: "Undetermined", status: null },
  { title: "Lost", status: LeadStatus.LOST },
];

function InnerInteractiveTable({
  leadType,
  title,
  createButtonText,
}: InteractiveTableProps) {
  // 1. USAR HOOK OPTIMIZADO PARA LEADS CON CACHE INSTANTÁNEO
  const {
    items: leads = [],
    loading: isLoading,
    showSkeleton,
    refresh: refetchLeads,
    error,
  } = useInstantList(
    `leads_${leadType}`,
    () => OptimizedLeadsService.getLeadsByType(leadType),
    {
      ttl: 300000, // 5 minutos
      showSkeletonOnlyOnFirstLoad: true,
    }
  );

  // Integración con Loading Manager centralizado
  const { showLoading, hideLoading, setSkeleton } = useLoading();

  useEffect(() => {
    // Configuramos el tipo de skeleton una vez
    setSkeleton("leadsTable", { rows: 8, showSections: true });
  }, [setSkeleton]);

  useEffect(() => {
    if (showSkeleton || isLoading) {
      showLoading("leadsTable", { rows: 8, showSections: true });
    } else {
      hideLoading();
    }
    return () => {
      hideLoading();
    };
  }, [showSkeleton, isLoading, showLoading, hideLoading]);

  // 2. USAR HOOKS OPTIMIZADOS PARA PROJECT TYPES Y CONTACTS
  const { items: projectTypes = [] } = useInstantList(
    "project_types",
    ProjectTypeService.getProjectTypes,
    { ttl: 600000 } // 10 minutos
  );

  const { items: contacts = [] } = useInstantList(
    "contacts",
    OptimizedContactsService.getAllContacts,
    { ttl: 300000 } // 5 minutos
  );

  // 3. ESTADO LOCAL OPTIMIZADO
  const [modals, setModals] = useState({
    isCreateOpen: false,
    isEditOpen: false,
    editingLead: null as Lead | null,
  });

  // 4. CALLBACKS OPTIMIZADOS CON USECALLBACK
  const handleLeadCreated = useCallback(
    (newLead: Lead) => {
      // Optimistic update + refetch para consistencia
      refetchLeads();
    },
    [refetchLeads]
  );

  const handleLeadUpdated = useCallback(
    (updatedLead: Lead) => {
      // Optimistic update + refetch
      refetchLeads();
    },
    [refetchLeads]
  );

  const handleLeadDeleted = useCallback(
    async (leadId: number) => {
      try {
        await deleteLead(leadId);
        refetchLeads(); // Refetch después de eliminar
      } catch (error) {
        console.error("Error deleting lead:", error);
        // TODO: Agregar toast/notification de error
      }
    },
    [refetchLeads]
  );

  // 5. HANDLERS DE MODALES OPTIMIZADOS
  const modalHandlers = useMemo(
    () => ({
      openCreate: () => setModals((prev) => ({ ...prev, isCreateOpen: true })),

      closeCreate: () =>
        setModals((prev) => ({ ...prev, isCreateOpen: false })),

      openEdit: (lead: Lead) =>
        setModals((prev) => ({
          ...prev,
          isEditOpen: true,
          editingLead: lead,
        })),

      closeEdit: () =>
        setModals((prev) => ({
          ...prev,
          isEditOpen: false,
          editingLead: null,
        })),
    }),
    []
  );

  // 6. SECCIONES MEMOIZADAS CON LÓGICA MEJORADA
  const sections = useMemo((): LeadSectionData[] => {
    return LEAD_SECTIONS.map(({ title, status }) => ({
      title,
      status,
      data: (leads ?? []).filter((lead) => {
        if (status === null) {
          return !lead.status || lead.status === null;
        }
        return lead.status === status;
      }),
    }));
  }, [leads]);

  // 7. COLUMNAS MEMOIZADAS
  const memoizedColumns = useMemo(() => leadTableColumns, []);

  // 8. EARLY RETURNS MEJORADOS - Ahora dependemos del sistema centralizado
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <div className="text-red-600 dark:text-red-400">
          Error loading leads: {error.message}
        </div>
        <GenericButton onClick={refetchLeads}>Try Again</GenericButton>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 9. HEADER MEJORADO */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {(leads ?? []).length} lead{(leads ?? []).length !== 1 ? "s" : ""}{" "}
            total
          </p>
        </div>
        <GenericButton
          className="text-sm"
          onClick={modalHandlers.openCreate}
          disabled={isLoading}
        >
          {createButtonText}
        </GenericButton>
      </header>

      {/* 10. MODALES CON SUSPENSE MEJORADO */}
      <Suspense
        fallback={
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
        }
      >
        {modals.isCreateOpen && (
          <CreateLeadModal
            isOpen={modals.isCreateOpen}
            onClose={modalHandlers.closeCreate}
            projectTypes={projectTypes ?? []}
            contacts={contacts ?? []}
            leadType={leadType}
            onLeadCreated={handleLeadCreated}
          />
        )}

        {modals.isEditOpen && modals.editingLead && (
          <EditLeadModal
            isOpen={modals.isEditOpen}
            onClose={modalHandlers.closeEdit}
            lead={modals.editingLead}
            projectTypes={projectTypes ?? []}
            contacts={contacts ?? []}
            onLeadUpdated={handleLeadUpdated}
          />
        )}
      </Suspense>

      {/* 11. SECCIONES CON KEY OPTIMIZADA */}
      <div className="space-y-6">
        {sections.map(({ title, data, status }) => (
          <LeadSection
            key={`${title}-${status}`} // Key más específica
            title={title}
            data={data}
            columns={memoizedColumns}
            onEditLead={modalHandlers.openEdit}
            onDeleteLead={handleLeadDeleted}
          />
        ))}
      </div>

      {/* 12. ESTADO VACÍO */}
      {(leads?.length ?? 0) === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            No {title.toLowerCase()} found
          </div>
          <GenericButton onClick={modalHandlers.openCreate}>
            Create your first {title.toLowerCase().slice(0, -1)}
          </GenericButton>
        </div>
      )}
    </div>
  );
}

export default function InteractiveTable(props: InteractiveTableProps) {
  return (
    <LoadingProvider>
      {/* Renderer centralizado de skeletons */}
      <SkeletonRenderer />
      {/* Contenido real */}
      <InnerInteractiveTable {...props} />
    </LoadingProvider>
  );
}
