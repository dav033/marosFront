// src/features/leads/types/entities.ts

import type {
  LeadStatus,
  LeadType,
} from "../../../types/enums";
import type { Contacts, ProjectType } from "../../../types/domain/entities";

export interface Lead {
  id: number;
  leadNumber: string;
  name: string;
  startDate: string;
  location?: string;
  status: LeadStatus;
  contact: Contacts;
  projectType: ProjectType;
  leadType: LeadType;
  description?: string;
  budget?: number;
  estimatedEndDate?: string;
  actualEndDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
