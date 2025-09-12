/**
 * Panel de configuración de cache para debugging
 */

import React from "react";
import { cacheConfig } from "src/lib/cacheConfig";

const CacheConfigPanel: React.FC = () => {
  const [config, setConfig] = React.useState(cacheConfig.get());

  const updateGlobalCache = (enabled: boolean) => {
    cacheConfig.set({ enabled });
    setConfig(cacheConfig.get());
  };

  const updateResourceCache = (
    resource: "contacts" | "leads" | "projectTypes",
    enabled: boolean
  ) => {
    cacheConfig.setResource(resource, { enabled });
    setConfig(cacheConfig.get());
  };

  const resetConfig = () => {
    cacheConfig.reset();
    setConfig(cacheConfig.get());
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Cache Configuration
        </h3>
        <button
          onClick={resetConfig}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Reset to Default
        </button>
      </div>

      {/* Global Cache Toggle */}
      <div className="mb-6">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateGlobalCache(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              Global Cache {config.enabled ? "Enabled" : "Disabled"}
            </span>
            <p className="text-xs text-gray-500">
              Master switch for all caching functionality
            </p>
          </div>
        </label>
      </div>

      {/* Resource-specific toggles */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">
          Resource-specific Settings
        </h4>

        {Object.entries(config.resources).map(([resource, settings]) => (
          <div
            key={resource}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) =>
                  updateResourceCache(resource as any, e.target.checked)
                }
                disabled={!config.enabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <div>
                <span className="text-sm text-gray-900 capitalize">
                  {resource}
                </span>
                <div className="text-xs text-gray-500">
                  TTL: {Math.round(settings.ttl / 1000 / 60)} minutes
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  settings.enabled && config.enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {settings.enabled && config.enabled ? "Active" : "Disabled"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Debug Settings */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Debug Settings
        </h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.debug.logCacheHits}
              onChange={(e) =>
                cacheConfig.set({
                  debug: { ...config.debug, logCacheHits: e.target.checked },
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Log cache hits</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.debug.logCacheMisses}
              onChange={(e) =>
                cacheConfig.set({
                  debug: { ...config.debug, logCacheMisses: e.target.checked },
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Log cache misses</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CacheConfigPanel;
