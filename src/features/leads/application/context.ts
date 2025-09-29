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
        projectType?: ProjectTypeRepositoryPort; 
  };
  services: {
    leadNumberAvailability: LeadNumberAvailabilityPort;
  };
}>;

export function makeLeadsAppContext(deps: LeadsAppContext): LeadsAppContext {
  return deps;
}
