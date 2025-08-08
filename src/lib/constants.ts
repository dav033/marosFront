import { LeadStatus } from "src/types/enums";

export const LOADING_KEY = "leadsTable";

export const LEAD_SECTIONS = [
  { title: "Pending",      status: LeadStatus.TO_DO },
  { title: "In Progress",  status: LeadStatus.IN_PROGRESS },
  { title: "Completed",    status: LeadStatus.DONE },
  { title: "Undetermined", status: null },
  { title: "Lost",         status: LeadStatus.LOST },
] as const;
