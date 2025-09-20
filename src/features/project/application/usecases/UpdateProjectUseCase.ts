// src/features/project/application/usecases/UpdateProjectUseCase.ts

import type { ProjectRepositoryPort } from "../../domain/ports/ProjectRepositoryPort";
import type { Project } from "../../domain/models/Project";
import type { ProjectId, ProjectPatch } from "../../types";
import { applyProjectPatch, ensureProjectIntegrity } from "../../domain/services";
import { BusinessRuleError } from "../../domain/errors/BusinessRuleError";

export interface UpdateProjectUseCasePort {
  execute(id: ProjectId, patch: ProjectPatch): Promise<Project>;
}

export class UpdateProjectUseCase implements UpdateProjectUseCasePort {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(id: ProjectId, patch: ProjectPatch): Promise<Project> {
    // Buscar el proyecto existente
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new BusinessRuleError("VALIDATION_ERROR", `Project with ID ${id} not found`);
    }

    // Aplicar el patch usando el servicio de dominio
    const patchResult = applyProjectPatch(existingProject, patch);
    
    // Si no hay cambios, retornar el proyecto original
    if (!patchResult.hasChanges) {
      return existingProject;
    }

    // Si se está cambiando el nombre, verificar que no esté en uso
    if (patch.projectName && patch.projectName !== existingProject.projectName) {
      const projectWithSameName = await this.projectRepository.findByName(patch.projectName);
      if (projectWithSameName && projectWithSameName.id !== id) {
        throw new BusinessRuleError("POLICY_VIOLATION", 
          `A project with name "${patch.projectName}" already exists`);
      }
    }

    // Si se está cambiando el leadId, verificar que exista
    if (patch.leadId !== undefined && patch.leadId !== existingProject.lead?.id) {
      if (patch.leadId !== null) {
        const leadExists = await this.projectRepository.leadExists(patch.leadId);
        if (!leadExists) {
          throw new BusinessRuleError("VALIDATION_ERROR", 
            `Lead with ID ${patch.leadId} does not exist`);
        }
      }
    }

    // Actualizar el proyecto
    const updatedProject = await this.projectRepository.update(id, patch);
    
    // Verificar integridad después de la actualización
    ensureProjectIntegrity(updatedProject);
    
    return updatedProject;
  }
}