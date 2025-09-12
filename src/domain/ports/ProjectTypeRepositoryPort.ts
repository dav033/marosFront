import type { ProjectType } from '../entities/ProjectType';

export interface ProjectTypeRepositoryPort {
  list(): Promise<ProjectType[]>;
}