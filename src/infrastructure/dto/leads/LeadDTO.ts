import type { ContactDTO } from "../contacts/ContactDTO";

export type LeadDTO = {
  id?: number;
  leadNumber: string;
  name: string;
  startDate: string;
  location: string;
  status: "NEW" | "UNDETERMINED" | "TO_DO" | "IN_PROGRESS" | "DONE" | "LOST" | "NOT_EXECUTED";
  contact: ContactDTO;
  projectType?: { id?: number; name: string; color: string } | null;
  leadType: "CONSTRUCTION" | "PLUMBING" | "ROOFING";
};