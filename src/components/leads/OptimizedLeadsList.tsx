/**
 * Ejemplo de componente que muestra datos instantáneamente desde cache
 * Skeleton solo aparece en la primera carga cuando no hay cache
 */

import React from 'react';
import { LeadType } from '../../types/enums';
import { OptimizedLeadsService } from '../../services/OptimizedLeadsService';
import { useCachedList } from '../../hooks/useOptimizedFetch';

interface OptimizedLeadsListProps {
  leadType: LeadType;
}

export const OptimizedLeadsList: React.FC<OptimizedLeadsListProps> = ({ leadType }) => {
  const {
    data: leads,
    loading,
    error,
    fromCache,
    cacheAge,
    forceRefresh
  } = useCachedList(
    () => OptimizedLeadsService.getLeadsByType(leadType),
    `leads_${leadType}`,
    {
      ttl: 300000, // 5 minutos
      refetchInterval: 60000, // Refrescar cada minuto en background
      backgroundRefresh: true
    }
  );

  // Loading solo se muestra si NO hay datos y estamos cargando
  // Si hay datos del cache, se muestran inmediatamente
  if (loading && !leads) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Loading Leads...</h2>
        </div>
        
        {/* Skeleton solo aparece cuando NO hay cache */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error loading leads</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
        <button 
          onClick={forceRefresh}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con indicadores de estado */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {leadType} Leads ({leads?.length || 0})
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Indicador de cache */}
          {fromCache && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              📦 Cached
              {cacheAge > 0 && (
                <span className="ml-1 text-green-600">
                  ({Math.round(cacheAge / 1000)}s ago)
                </span>
              )}
            </span>
          )}
          
          {/* Indicador de loading en background */}
          {loading && leads && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              🔄 Refreshing...
            </span>
          )}
          
          {/* Botón de refresh manual */}
          <button
            onClick={forceRefresh}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Lista de leads - se muestra inmediatamente si hay cache */}
      {leads && leads.length > 0 ? (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{lead.location}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {lead.leadNumber}
                    </span>
                    <span className="text-xs text-gray-500">
                      {lead.status}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(lead.startDate).toLocaleDateString()}
                  </p>
                  {lead.contact && (
                    <p className="text-sm text-blue-600 mt-1">
                      {lead.contact.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">📝</div>
          <p className="text-gray-600">No {leadType.toLowerCase()} leads found</p>
          <button
            onClick={forceRefresh}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh List
          </button>
        </div>
      )}

      {/* Performance info en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
          <strong>Dev Info:</strong> 
          {fromCache ? (
            <>
              ⚡ Loaded from cache instantly ({Math.round(cacheAge / 1000)}s old)
            </>
          ) : (
            <>
              🌐 Loaded from network (saved to cache)
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OptimizedLeadsList;
