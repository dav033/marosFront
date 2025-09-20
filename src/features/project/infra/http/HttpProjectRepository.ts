// src/features/project/infra/http/HttpProjectRepository.ts

import type { ProjectRepositoryPort } from "../../domain/ports/ProjectRepositoryPort";
import type { Project } from "../../domain/models/Project";
import type { ProjectId, LeadId, ProjectDraft, ProjectPatch } from "../../types";
import type { ProjectStatus } from "../../enums";
import { optimizedApiClient } from "@/lib/optimizedApiClient";

/**
 * Implementación HTTP del repositorio de proyectos.
 */
export class HttpProjectRepository implements ProjectRepositoryPort {
  private readonly baseUrl = "/api/projects";

  async findAll(): Promise<Project[]> {
    const response = await optimizedApiClient.get<Project[]>(this.baseUrl);
    return response.data;
  }

  async findById(id: ProjectId): Promise<Project | null> {
    try {
      const response = await optimizedApiClient.get<Project>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  async findByName(projectName: string): Promise<Project | null> {
    // El backend no tiene endpoint específico para buscar por nombre
    // Buscamos todos y filtramos en el cliente (no ideal para datasets grandes)
    const projects = await this.findAll();
    return projects.find(p => p.projectName === projectName) || null;
  }

  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    const response = await optimizedApiClient.get<Project[]>(`${this.baseUrl}/status`, {
      params: { status }
    });
    return response.data;
  }

  async findWithLeads(): Promise<Project[]> {
    const response = await optimizedApiClient.get<Project[]>(`${this.baseUrl}/with-leads`);
    return response.data;
  }

  async saveNew(draft: ProjectDraft): Promise<Project> {
    const response = await optimizedApiClient.post<Project>(this.baseUrl, draft);
    return response.data;
  }

  async update(id: ProjectId, patch: ProjectPatch): Promise<Project> {
    const response = await optimizedApiClient.put<Project>(`${this.baseUrl}/${id}`, patch);
    return response.data;
  }

  async delete(id: ProjectId): Promise<void> {
    await optimizedApiClient.delete(`${this.baseUrl}/${id}`);
  }

  async count(): Promise<number> {
    const response = await optimizedApiClient.get<{ count: number }>(`${this.baseUrl}/count`);
    return response.data.count;
  }

  async leadExists(leadId: LeadId): Promise<boolean> {
    try {
      // Asumiendo que existe un endpoint para verificar leads
      const response = await optimizedApiClient.get(`/api/leads/${leadId}`);
      return response.status === 200;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return false;
        }
      }
      throw error;
    }
  }
}