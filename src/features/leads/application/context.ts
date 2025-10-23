import type { Clock, LeadNumberAvailabilityPort, LeadRepositoryPort } from "@/leads";
import type { ProjectTypeRepositoryPort } from "@/leads";

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
