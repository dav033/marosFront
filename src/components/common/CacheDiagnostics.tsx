/**
 * Componente de diagnóstico de cache y performance
 * Muestra métricas en tiempo real del sistema de cache
 */


import React, { useState, useEffect } from "react";
import { optimizedApiClient } from "../../lib/optimizedApiClient";
import { globalCache, apiCache } from "../../lib/cacheManager";
import { prefetchManager } from "../../lib/prefetchManager";
import type { CacheMetrics } from "../../types/cache";

interface CacheDiagnosticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CacheDiagnostics: React.FC<CacheDiagnosticsProps> = ({
  isOpen,
  onClose,
}) => {
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!isOpen) return;


    const updateMetrics = () => {
      // Usar el tipado correcto directamente
      setMetrics(optimizedApiClient.getMetrics());
    };

    updateMetrics();

    let interval: number | null = null;
    if (autoRefresh) {
      interval = window.setInterval(updateMetrics, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, autoRefresh]);

  const handleClearCache = () => {
    optimizedApiClient.clearCache();
    setMetrics(null);
  };

  const handleResetMetrics = () => {
    optimizedApiClient.resetMetrics();
    setMetrics(null);
  };

  if (!isOpen || !metrics) return null;

  const {
    client,
    globalCache: globalStats,
    apiCache: apiStats,
    prefetch,
  } = metrics;
  const timestamp = new Date().toLocaleTimeString();

  const hitRate =
    client.totalRequests > 0
      ? Math.round((client.cacheHits / client.totalRequests) * 100)
      : 0;

  const errorRate =
    client.totalRequests > 0
      ? Math.round((client.failedRequests / client.totalRequests) * 100)
      : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Cache & Performance Diagnostics
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded text-sm ${
                  autoRefresh
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {autoRefresh ? "🔄 Auto" : "⏸️ Manual"}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            Última actualización: {timestamp}
          </div>

          {/* API Client Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Requests</h3>
              <div className="space-y-1 text-sm">
                <div>
                  Total:{" "}
                  <span className="font-mono">{client.totalRequests}</span>
                </div>
                <div>
                  Cache Hits:{" "}
                  <span className="font-mono text-green-600">
                    {client.cacheHits}
                  </span>
                </div>
                <div>
                  Cache Misses:{" "}
                  <span className="font-mono text-orange-600">
                    {client.cacheMisses}
                  </span>
                </div>
                <div>
                  Network:{" "}
                  <span className="font-mono">{client.networkRequests}</span>
                </div>
                <div>
                  Failed:{" "}
                  <span className="font-mono text-red-600">
                    {client.failedRequests}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Performance</h3>
              <div className="space-y-1 text-sm">
                <div>
                  Hit Rate:{" "}
                  <span
                    className={`font-mono ${hitRate > 50 ? "text-green-600" : "text-orange-600"}`}
                  >
                    {hitRate}%
                  </span>
                </div>
                <div>
                  Error Rate:{" "}
                  <span
                    className={`font-mono ${errorRate < 5 ? "text-green-600" : "text-red-600"}`}
                  >
                    {errorRate}%
                  </span>
                </div>
                <div>
                  Avg Response:{" "}
                  <span className="font-mono">
                    {client.averageResponseTime}ms
                  </span>
                </div>
                <div>
                  Prefetch Success:{" "}
                  <span className="font-mono text-green-600">
                    {client.prefetchSuccess}
                  </span>
                </div>
                <div>
                  Prefetch Failed:{" "}
                  <span className="font-mono text-red-600">
                    {client.prefetchFailed}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Prefetch Queue
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  Total Tasks:{" "}
                  <span className="font-mono">{prefetch.total}</span>
                </div>
                <div>
                  Pending:{" "}
                  <span className="font-mono text-orange-600">
                    {prefetch.pending}
                  </span>
                </div>
                <div>
                  Running:{" "}
                  <span className="font-mono text-blue-600">
                    {prefetch.runningTasks}
                  </span>
                </div>
                <div>
                  Completed:{" "}
                  <span className="font-mono text-green-600">
                    {prefetch.completed}
                  </span>
                </div>
                <div>
                  Queue Size:{" "}
                  <span className="font-mono">{prefetch.queueSize}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cache Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">API Cache</h3>
              <div className="space-y-1 text-sm">
                <div>
                  Size:{" "}
                  <span className="font-mono">
                    {apiStats.size} / {apiStats.maxSize}
                  </span>
                </div>
                <div>
                  Valid Entries:{" "}
                  <span className="font-mono text-green-600">
                    {apiStats.valid}
                  </span>
                </div>
                <div>
                  Expired:{" "}
                  <span className="font-mono text-red-600">
                    {apiStats.expired}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(apiStats.size / apiStats.maxSize) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Global Cache</h3>
              <div className="space-y-1 text-sm">
                <div>
                  Size:{" "}
                  <span className="font-mono">
                    {globalStats.size} / {globalStats.maxSize}
                  </span>
                </div>
                <div>
                  Valid Entries:{" "}
                  <span className="font-mono text-green-600">
                    {globalStats.valid}
                  </span>
                </div>
                <div>
                  Expired:{" "}
                  <span className="font-mono text-red-600">
                    {globalStats.expired}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(globalStats.size / globalStats.maxSize) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Performance Indicators
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-3 rounded">
                <div
                  className={`text-2xl mb-1 ${hitRate > 70 ? "text-green-500" : hitRate > 40 ? "text-yellow-500" : "text-red-500"}`}
                >
                  {hitRate > 70 ? "🟢" : hitRate > 40 ? "🟡" : "🔴"}
                </div>
                <div className="text-xs text-gray-600">Cache Hit Rate</div>
              </div>

              <div className="bg-white p-3 rounded">
                <div
                  className={`text-2xl mb-1 ${client.averageResponseTime < 100 ? "text-green-500" : client.averageResponseTime < 300 ? "text-yellow-500" : "text-red-500"}`}
                >
                  {client.averageResponseTime < 100
                    ? "🟢"
                    : client.averageResponseTime < 300
                      ? "🟡"
                      : "🔴"}
                </div>
                <div className="text-xs text-gray-600">Response Time</div>
              </div>

              <div className="bg-white p-3 rounded">
                <div
                  className={`text-2xl mb-1 ${errorRate < 2 ? "text-green-500" : errorRate < 5 ? "text-yellow-500" : "text-red-500"}`}
                >
                  {errorRate < 2 ? "🟢" : errorRate < 5 ? "🟡" : "🔴"}
                </div>
                <div className="text-xs text-gray-600">Error Rate</div>
              </div>

              <div className="bg-white p-3 rounded">
                <div
                  className={`text-2xl mb-1 ${prefetch.completed > prefetch.failed ? "text-green-500" : "text-yellow-500"}`}
                >
                  {prefetch.completed > prefetch.failed ? "🟢" : "🟡"}
                </div>
                <div className="text-xs text-gray-600">Prefetch Health</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              🗑️ Clear Cache
            </button>
            <button
              onClick={handleResetMetrics}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              📊 Reset Metrics
            </button>
            <button
              onClick={() => prefetchManager.cleanup()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              🧹 Cleanup Prefetch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheDiagnostics;
