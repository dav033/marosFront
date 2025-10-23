import type { ProjectRepositoryPort } from "@/project";

export function makeProjectsAppContext(deps: ProjectsAppContext): ProjectsAppContext {
  return deps;
}

export type ProjectsAppContext = Readonly<{
  repos: Readonly<{ project: ProjectRepositoryPort }>;
  ports?: Readonly<{}>;
}>;
