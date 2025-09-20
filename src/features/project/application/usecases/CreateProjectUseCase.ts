// src/features/project/application/usecases/CreateProjectUseCase.ts

import type { ProjectRepositoryPort } from "../../domain/ports/ProjectRepositoryPort";
import type { Project } from "../../domain/models/Project";
import type { ProjectDraft, ProjectPolicies, Clock } from "../../types";
import { SystemClock } from "../../types";
import { buildProjectDraft, ensureProjectIntegrity } from "../../domain/services";
import { BusinessRuleError } from "../../domain/errors/BusinessRuleError";

export interface CreateProjectUseCasePort {
  execute(draft: ProjectDraft, policies?: ProjectPolicies): Promise<Project>;
}

export class CreateProjectUseCase implements CreateProjectUseCasePort {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(draft: ProjectDraft, policies?: ProjectPolicies): Promise<Project> {
    // Validar el borrador usando los servicios de dominio
    const validatedDraft = buildProjectDraft(draft, policies, SystemClock);
    
    // Verificar que el nombre del proyecto no esté en uso
    const existingProject = await this.projectRepository.findByName(validatedDraft.projectName);
    if (existingProject) {
      throw new BusinessRuleError("POLICY_VIOLATION", 
        `A project with name "${validatedDraft.projectName}" already exists`);
    }

    // Si se especifica un leadId, verificar que exista
    if (validatedDraft.leadId) {
      const leadExists = await this.projectRepository.leadExists(validatedDraft.leadId);
      if (!leadExists) {
        throw new BusinessRuleError("VALIDATION_ERROR", 
          `Lead with ID ${validatedDraft.leadId} does not exist`);
      }
    }

    // Crear el proyecto
    const createdProject = await this.projectRepository.saveNew(validatedDraft);
    
    // Verificar integridad después de la creación
    ensureProjectIntegrity(createdProject);
    
    return createdProject;
  }
}