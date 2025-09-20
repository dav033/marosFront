// src/features/leads/domain/ports/LeadNumberAvailabilityPort.ts

/**
 * Puerto para consultar la disponibilidad (unicidad) de un leadNumber.
 * Un adapter típico llamará a /leads/validate/lead-number en la API.
 */
export interface LeadNumberAvailabilityPort {
  /**
   * @returns true si el número está disponible (no hay conflicto/duplicado).
   */
  isAvailable(leadNumber: string): Promise<boolean>;
}
