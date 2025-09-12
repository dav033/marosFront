/**
 * PRESENTATION LAYER - CLEAN ARCHITECTURE
 * 
 * Esta capa contiene componentes puros de UI, hooks de presentación y view models.
 * NO debe contener lógica de negocio, solo orquestar casos de uso de la capa de aplicación.
 * 
 * Estructura:
 * - components/: Componentes React organizados por feature
 * - hooks/: Hooks que conectan componentes con casos de uso
 * - view-models/: Transformaciones de datos para la UI
 * - providers/: Contextos de React para estado transversal
 * - devtools/: Herramientas de desarrollo (solo en dev)
 */

export type PresentationLayer = {
  // Marker type para documentar la capa
  readonly __brand: 'PresentationLayer';
};