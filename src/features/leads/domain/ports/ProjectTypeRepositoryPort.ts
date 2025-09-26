import type { ProjectType } from "../models/ProjectType";

export interface ProjectTypeRepositoryPort {
  findAll(): Promise<ProjectType[]>;
}
