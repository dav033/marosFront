// src/features/project/infra/ProjectHttpGateway.ts
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

export type ProjectsDto = {
  id: number;
  projectName: string;
  overview?: string;
  payments?: number[];
  projectStatus?: string | null;
  invoiceStatus?: string | null;
  quickbooks?: boolean;
  startDate?: string | null; // ISO (LocalDate → "YYYY-MM-DD")
  endDate?: string | null;
  // Datos del lead/contact:
  leadId: number;
  leadName: string;
  leadNumber: string;
  location: string;
  contactName?: string;
  customerName?: string; // “client name”
};

export class ProjectHttpGateway {
  async getProjectsWithLeads(): Promise<ProjectsDto[]> {
    const res = await optimizedApiClient.get<ProjectsDto[]>(("/api/projects/with-leads"), { withCredentials: true });
    return res.data;
  }
}
