/**
 * Ejemplo de componente que NO muestra skeleton en navegaciones repetidas
 * Solo muestra skeleton en la primera carga
 */

import React, { useEffect } from "react";
import { useInstantList } from "../../hooks/useInstantData";
import { OptimizedLeadsService } from "../../services/OptimizedLeadsService";
import type { Lead, InstantLeadsListProps } from "@/types";
import { LoadingProvider, useLoading } from "src/contexts/LoadingContext";
import { SkeletonRenderer } from "@components/common/SkeletonRenderer";

const InnerInstantLeadsList: React.FC<InstantLeadsListProps> = ({
  leadType,
}) => {
  const {
    items: leads,
    loading,
    error,
    fromCache,
    showSkeleton, // Solo true en primera carga sin cache
    hasData,
    isEmpty,
    refresh,
  } = useInstantList(
    `leads_${leadType}`,
    () => OptimizedLeadsService.getLeadsByType(leadType),
    {
      ttl: 300000, // 5 minutos
      showSkeletonOnlyOnFirstLoad: true,
    }
  );

  const { setSkeleton, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setSkeleton("list", { rows: 6 });
  }, [setSkeleton]);

  useEffect(() => {
    if (showSkeleton) {
      showLoading("list", { rows: 6 });
    } else {
      hideLoading();
    }
    return () => hideLoading();
  }, [showSkeleton, showLoading, hideLoading]);

  // Mostrar error si existe
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error loading leads</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
        <button
          onClick={refresh}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Si no hay datos pero no está cargando (cache vacío)
  if (isEmpty && !loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📋</div>
        <h3 className="text-lg font-medium">No leads found</h3>
        <p className="text-sm">Try creating a new lead</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Indicador de origen de datos */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {leadType} Leads ({leads.length})
        </h2>
        <div className="flex items-center space-x-2">
          {fromCache && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              📦 Cached
            </span>
          )}
          {loading && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              🔄 Updating...
            </span>
          )}
          <button
            onClick={refresh}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Lista de leads - aparece INSTANTÁNEAMENTE en navegaciones repetidas */}
      <div className="grid gap-4">
        {leads.map((lead: Lead) => (
          <LeadCard key={lead.id} lead={lead} isFromCache={fromCache} />
        ))}
      </div>
    </div>
  );
};

// Componente de tarjeta de lead con indicador de cache
const LeadCard: React.FC<{ lead: Lead; isFromCache: boolean }> = ({
  lead,
  isFromCache,
}) => (
  <div className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-gray-900">{lead.name}</h3>
        <p className="text-sm text-gray-600">{lead.location}</p>
        <p className="text-xs text-gray-500">Status: {lead.status}</p>
      </div>
      <div className="flex items-center space-x-2">
        {isFromCache && (
          <span className="text-xs text-green-600" title="Loaded from cache">
            📦
          </span>
        )}
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            lead.status === "DONE"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {lead.status}
        </span>
      </div>
    </div>
  </div>
);

const InstantLeadsList: React.FC<InstantLeadsListProps> = (props) => (
  <LoadingProvider>
    <SkeletonRenderer />
    <InnerInstantLeadsList {...props} />
  </LoadingProvider>
);

export default InstantLeadsList;
