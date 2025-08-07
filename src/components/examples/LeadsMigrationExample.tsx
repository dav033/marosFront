/**
 * Ejemplo de cómo migrar un componente existente que usa useFetch
 * ANTES vs DESPUÉS - mostrando el comportamiento de skeleton inteligente
 */

import React from 'react';
import { LeadType } from '../../types/enums';
import type { Lead } from '../../types/types';
import { LeadsService } from '../../services/LeadsService';
import { OptimizedLeadsService } from '../../services/OptimizedLeadsService';
import { useFetch } from '../../hooks/UseFetchResult';

// ===== VERSIÓN ANTERIOR (CON SKELETON SIEMPRE) =====
export const LeadsListBefore: React.FC<{ type: LeadType }> = ({ type }) => {
  const { data: leads, loading, error, refetch } = useFetch(
    LeadsService.getLeadsByType,
    [type]
  );

  // ❌ PROBLEMA: Skeleton aparece SIEMPRE, incluso con cache
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-lg font-semibold mb-4">Loading Leads...</div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-300 h-16 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Leads ({leads?.length || 0})</h2>
      {leads?.map((lead: Lead) => (
        <div key={lead.id} className="border p-4 rounded">
          {lead.name} - {lead.location}
        </div>
      ))}
    </div>
  );
};

// ===== VERSIÓN NUEVA (CON CACHE INTELIGENTE) =====
import { useCachedList } from '../../hooks/useOptimizedFetch';
import { CacheIndicator, SmartSkeleton } from '../../utils/cacheHelpers';

export const LeadsListAfter: React.FC<{ type: LeadType }> = ({ type }) => {
  const {
    data: leads,
    loading,
    error,
    fromCache,
    cacheAge,
    forceRefresh
  } = useCachedList(
    () => OptimizedLeadsService.getLeadsByType(type),
    `leads_${type}`,
    { ttl: 300000 } // 5 minutos
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <div>Error: {error.message}</div>
        <button onClick={forceRefresh} className="mt-2 px-3 py-1 bg-red-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header con indicadores de estado */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Leads ({leads?.length || 0})
        </h2>
        
        <div className="flex items-center gap-2">
          <CacheIndicator 
            fromCache={fromCache}
            loading={loading}
            cacheAge={cacheAge}
          />
          <button 
            onClick={forceRefresh}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            🔄
          </button>
        </div>
      </div>

      {/* ✅ SOLUCIÓN: Skeleton inteligente */}
      <SmartSkeleton
        show={loading}
        fromCache={fromCache}
        fallback={
          <div className="space-y-3">
            <div className="text-gray-500 mb-4">Loading leads for the first time...</div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-300 h-16 rounded"></div>
            ))}
          </div>
        }
      >
        {/* Contenido real - se muestra instantáneamente si hay cache */}
        <div className="space-y-3">
          {leads?.map(lead => (
            <div 
              key={lead.id} 
              className={`border p-4 rounded transition-all ${
                fromCache ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{lead.name}</h3>
                  <p className="text-gray-600 text-sm">{lead.location}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                    {lead.leadNumber}
                  </span>
                </div>
                {fromCache && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    📦 From Cache
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {!leads?.length && (
            <div className="text-center py-8 text-gray-500">
              No leads found for {type}
            </div>
          )}
        </div>
      </SmartSkeleton>

      {/* Info de desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <strong>Cache Info:</strong> {fromCache ? 
            `⚡ Instant load from cache (${Math.round((cacheAge || 0) / 1000)}s old)` : 
            '🌐 Fresh data from network'
          }
        </div>
      )}
    </div>
  );
};

// ===== MIGRACIÓN GRADUAL (MISMO COMPONENTE, ACTIVAR CACHE GRADUALMENTE) =====
import { useMigratedFetch } from '../../utils/cacheHelpers';

export const LeadsListMigration: React.FC<{ type: LeadType; enableCache?: boolean }> = ({ 
  type, 
  enableCache = false 
}) => {
  const {
    data: leads,
    loading,
    error,
    fromCache,
    migrateToCache
  } = useMigratedFetch(
    LeadsService.getLeadsByType,
    [type]
  );

  // Activar cache si está habilitado
  React.useEffect(() => {
    if (enableCache) {
      migrateToCache(`leads_${type}`);
    }
  }, [enableCache, type, migrateToCache]);

  return (
    <div>
      {/* Toggle para probar la migración */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-yellow-50 border rounded">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableCache}
              onChange={(e) => {
                if (e.target.checked) {
                  migrateToCache(`leads_${type}`);
                }
              }}
            />
            Enable Cache (Migration Test)
          </label>
        </div>
      )}

      <SmartSkeleton
        show={loading}
        fromCache={fromCache}
        fallback={<div className="animate-pulse bg-gray-300 h-40 rounded"></div>}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2>Leads ({leads?.length || 0})</h2>
            <CacheIndicator fromCache={fromCache} loading={loading} />
          </div>
          
          {leads?.map(lead => (
            <div key={lead.id} className="border p-3 rounded">
              {lead.name} - {lead.location}
            </div>
          ))}
        </div>
      </SmartSkeleton>
    </div>
  );
};

export default LeadsListAfter;
