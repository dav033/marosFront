import type { Project } from "@/features/project/domain/models/Project";

import type { ProjectsAppContext } from "../../context";

export async function getProjects(ctx: ProjectsAppContext): Promise<Project[]> {
  return ctx.repos.project.findAll();
}