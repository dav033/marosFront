// Application context for Project feature
import type { ProjectRepositoryPort } from "@/features/project/domain/ports/ProjectRepositoryPort";

export function makeProjectsAppContext(deps: ProjectsAppContext): ProjectsAppContext {
  return deps;
}

export type ProjectsAppContext = Readonly<{
  repos: Readonly<{ project: ProjectRepositoryPort }>;
  ports?: Readonly<{}>;
}>;
