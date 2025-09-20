import type { Lead } from "@/features/leads/domain/models/Lead";
import type { InvoiceStatus, ProjectStatus } from "../../enums";

export interface Project {
  id: number;
  projectName: string; // Backend uses 'projectName' not 'name'
  overview?: string; // Backend uses 'overview' not 'description'
  payments?: number[]; // List<Float> from backend
  projectStatus: ProjectStatus;
  invoiceStatus: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: string; // LocalDate from backend, received as ISO string
  lead: Lead;
  endDate?: string; // LocalDate from backend, received as ISO string
}
