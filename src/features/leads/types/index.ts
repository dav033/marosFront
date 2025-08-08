import type { Lead } from "src/types";
import type { LeadStatus } from "src/types/enums";

export interface InteractiveTableProps {
  leadType: import("src/types/enums").LeadType;
  title: string;
  createButtonText: string;
}

export interface LeadSectionData {
  title: string;
  status: LeadStatus | null;
  data: Lead[];
}
