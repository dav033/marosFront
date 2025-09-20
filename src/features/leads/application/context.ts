// src/features/leads/application/context.ts
import type {
  Clock,
  LeadRepositoryPort,
  LeadNumberAvailabilityPort,
} from "@/features/leads/domain";

export type LeadsAppContext = Readonly<{
  clock: Clock;
  repos: {
    lead: LeadRepositoryPort;
  };
  services: {
    leadNumberAvailability: LeadNumberAvailabilityPort;
  };
}>;

/** Pequeño factory para mantener tipado y permitir extender luego si hace falta. */
export function makeLeadsAppContext(deps: LeadsAppContext): LeadsAppContext {
  return deps;
}
