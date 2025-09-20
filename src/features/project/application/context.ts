// src/features/project/application/context.ts

import type {
  GetProjectsUseCasePort,
  GetProjectByIdUseCasePort,
  CreateProjectUseCasePort,
  UpdateProjectUseCasePort,
  DeleteProjectUseCasePort,
  GetProjectsWithLeadsUseCasePort,
} from "./usecases";

/**
 * Contexto de aplicación para la feature de proyectos.
 * Contiene todos los casos de uso disponibles.
 */
export interface ProjectApplicationContext {
  // Consultas
  getProjects: GetProjectsUseCasePort;
  getProjectById: GetProjectByIdUseCasePort;
  getProjectsWithLeads: GetProjectsWithLeadsUseCasePort;
  
  // Comandos
  createProject: CreateProjectUseCasePort;
  updateProject: UpdateProjectUseCasePort;
  deleteProject: DeleteProjectUseCasePort;
}