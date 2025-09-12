import type { Lead } from "../../../domain/entities/Lead";

export type LeadVM = {
  id?: number;
  leadNumber: string;
  name: string;
  contactName: string;
  startDateLabel: string;
  status: string;
  type: string;
  location: string;
  projectType: string;
};

export function toLeadVM(l: Lead): LeadVM {
  return {
    id: l.id,
    leadNumber: l.leadNumber,
    name: l.name,
    contactName: l.contact.name,
    startDateLabel: l.startDate ? new Date(l.startDate).toLocaleDateString() : "",
    status: l.status,
    type: l.leadType,
    location: l.location,
    projectType: l.projectType?.name ?? ""
  };
}