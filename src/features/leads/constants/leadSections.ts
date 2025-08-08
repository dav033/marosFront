import { LeadStatus } from "src/types/enums";

export const LEAD_SECTIONS: Array<{
  title: string;
  status: LeadStatus | null;
}> = [
  { title: "Pending", status: LeadStatus.TO_DO },
  { title: "In Progress", status: LeadStatus.IN_PROGRESS },
  { title: "Completed", status: LeadStatus.DONE },
  { title: "Undetermined", status: null },
  { title: "Lost", status: LeadStatus.LOST },
];
