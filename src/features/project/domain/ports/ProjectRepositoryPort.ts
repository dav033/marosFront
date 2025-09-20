// src/features/project/domain/ports/ProjectRepositoryPort.ts

import type { Project } from "../models/Project";
import type { ProjectId, ProjectDraft, ProjectPatch, LeadId } from "../../../project/types";
import type { ProjectStatus } from "../../enums";

/**
 * Puerto de repositorio para el agregado Project.
 * La infraestructura proveerá el adapter (HTTP, DB, etc.).
 */
export interface ProjectRepositoryPort {
  /** Obtiene un Project por id, o null si no existe. */
  findById(id: ProjectId): Promise<Project | null>;

  /** Lista todos los Projects. */
  findAll(): Promise<Project[]>;

  /** Lista Projects por status (IN_PROGRESS, COMPLETED, etc.). */
  findByStatus(status: ProjectStatus): Promise<Project[]>;

  /** Lista Projects que tienen lead asignado. */
  findWithLeads(): Promise<Project[]>;

  /** Persiste un Project nuevo a partir de un draft y devuelve el Project creado. */
  saveNew(draft: ProjectDraft): Promise<Project>;

  /** Actualiza un Project existente con un patch. */
  update(id: ProjectId, patch: ProjectPatch): Promise<Project>;

  /** Elimina un Project por id. */
  delete(id: ProjectId): Promise<void>;

  /** Busca un Project por nombre exacto. */
  findByName(projectName: string): Promise<Project | null>;

  /** Verifica si existe un Lead con el ID dado. */
  leadExists(leadId: LeadId): Promise<boolean>;

  /** Obtiene el conteo total de proyectos. */
  count(): Promise<number>;
}