/**
 * Hook types for cache diagnostics functionality
 */

export interface CacheDebugConfig {
  enabled: boolean;
  hotkey: string; // Tecla para abrir diagnostics (ej: 'F12', 'Ctrl+Shift+D')
  autoShow: boolean; // Mostrar automáticamente en development
  showInProduction: boolean;
}
