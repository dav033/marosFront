// Capa: Application — Contexto de Leads (se agrega projectType repo)
import type {
  Clock,
  LeadNumberAvailabilityPort,
  LeadRepositoryPort,
} from "@/features/leads/domain";
import type { ProjectTypeRepositoryPort } from "@/features/leads/domain/ports/ProjectTypeRepositoryPort";

export type LeadsAppContext = Readonly<{
  clock: Clock;
  repos: {
    contact: any;
    lead: LeadRepositoryPort;
    /** Nuevo: repositorio de tipos de proyecto */
    projectType?: ProjectTypeRepositoryPort; // opcional para compatibilidad
  };
  services: {
    leadNumberAvailability: LeadNumberAvailabilityPort;
  };
}>;

/** Factory tipado (permite extender sin romper) */
export function makeLeadsAppContext(deps: LeadsAppContext): LeadsAppContext {
  return deps;
}
