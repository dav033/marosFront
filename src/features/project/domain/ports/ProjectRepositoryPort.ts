import type { ProjectStatus } from "@/features/project/enums";
import type { LeadId,ProjectDraft, ProjectId, ProjectPatch } from "@/features/project/types";

import type { Project } from "../models/Project";

/** Puerto/contrato del repositorio de Projects. */
export interface ProjectRepositoryPort {
  findById(id: ProjectId): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByStatus(status: ProjectStatus): Promise<Project[]>;
  findWithLeads(): Promise<Project[]>;
  saveNew(draft: ProjectDraft): Promise<Project>;
  update(id: ProjectId, patch: ProjectPatch): Promise<Project>;
  delete(id: ProjectId): Promise<void>;
  findByName(projectName: string): Promise<Project | null>;
  leadExists(leadId: LeadId): Promise<boolean>;
  count(): Promise<number>;
}
