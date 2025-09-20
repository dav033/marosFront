// src/features/project/application/usecases/DeleteProjectUseCase.ts

import type { ProjectRepositoryPort } from "../../domain/ports/ProjectRepositoryPort";
import type { ProjectId } from "../../types";
import { BusinessRuleError } from "../../domain/errors/BusinessRuleError";

export interface DeleteProjectUseCasePort {
  execute(id: ProjectId): Promise<void>;
}

export class DeleteProjectUseCase implements DeleteProjectUseCasePort {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(id: ProjectId): Promise<void> {
    // Verificar que el proyecto existe
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new BusinessRuleError("VALIDATION_ERROR", `Project with ID ${id} not found`);
    }

    // Aquí podrías agregar validaciones adicionales, por ejemplo:
    // - No permitir eliminar proyectos en ciertos estados
    // - Verificar permisos del usuario
    // - Manejar dependencias (pagos, documentos, etc.)

    // Eliminar el proyecto
    await this.projectRepository.delete(id);
  }
}