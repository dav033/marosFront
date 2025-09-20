// src/features/project/infra/ProjectApplicationContextFactory.ts

import type { ProjectApplicationContext } from "../application/context";
import type { ProjectRepositoryPort } from "../domain/ports/ProjectRepositoryPort";
import {
  GetProjectsUseCase,
  GetProjectByIdUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectsWithLeadsUseCase,
} from "../application/usecases";
import { HttpProjectRepository } from "./http/HttpProjectRepository";

/**
 * Factory para crear el contexto de aplicación de proyectos.
 */
export class ProjectApplicationContextFactory {
  /**
   * Crea un contexto de aplicación con implementaciones HTTP.
   */
  static createHttpContext(): ProjectApplicationContext {
    const repository: ProjectRepositoryPort = new HttpProjectRepository();

    return {
      // Consultas
      getProjects: new GetProjectsUseCase(repository),
      getProjectById: new GetProjectByIdUseCase(repository),
      getProjectsWithLeads: new GetProjectsWithLeadsUseCase(repository),
      
      // Comandos
      createProject: new CreateProjectUseCase(repository),
      updateProject: new UpdateProjectUseCase(repository),
      deleteProject: new DeleteProjectUseCase(repository),
    };
  }

  /**
   * Crea un contexto de aplicación con un repositorio customizado.
   * Útil para testing o implementaciones alternativas.
   */
  static createWithRepository(repository: ProjectRepositoryPort): ProjectApplicationContext {
    return {
      // Consultas
      getProjects: new GetProjectsUseCase(repository),
      getProjectById: new GetProjectByIdUseCase(repository),
      getProjectsWithLeads: new GetProjectsWithLeadsUseCase(repository),
      
      // Comandos
      createProject: new CreateProjectUseCase(repository),
      updateProject: new UpdateProjectUseCase(repository),
      deleteProject: new DeleteProjectUseCase(repository),
    };
  }
}