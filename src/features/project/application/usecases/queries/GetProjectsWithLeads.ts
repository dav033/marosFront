import type { Project } from "@/features/project/domain/models/Project";

import type { ProjectsAppContext } from "../../context";

export async function getProjectsWithLeads(
  ctx: ProjectsAppContext
): Promise<Project[]> {
  return ctx.repos.project.findWithLeads();
}
