import type { Contact } from "@/features/contact/domain/models/Contact";

import type { LeadStatus, LeadType } from "../../enums";
import type { ProjectType } from "./ProjectType";

export interface Lead {
  type(type: any): unknown;
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
