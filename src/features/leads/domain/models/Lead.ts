import type { Contact } from "@/contact";
import type { LeadStatus, LeadType, ProjectType } from "@/leads";

export interface Lead {
  id: number;
  leadNumber: string;
  name: string;
  startDate: string; 
  location?: string | undefined;
  status: LeadStatus;
  contact: Contact;
  projectType: ProjectType;
  leadType: LeadType;
}
