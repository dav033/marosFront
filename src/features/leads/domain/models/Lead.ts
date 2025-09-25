import type { Contact } from "@/features/contact/domain/models/Contact";

import type { LeadStatus, LeadType } from "../../enums";
import type { ProjectType } from "./ProjectType";

export interface Lead {
  id: number;
  leadNumber: string;
  name: string;
  startDate: string; // LocalDate from backend, received as ISO string
  location?: string | undefined;
  status: LeadStatus;
  contact: Contact;
  projectType: ProjectType;
  leadType: LeadType;
}
