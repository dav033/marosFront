import type { Project } from "@/project";
import type { ProjectsAppContext } from "@/project";

export async function getProjectsWithLeads(
  ctx: ProjectsAppContext
): Promise<Project[]> {
  return ctx.repos.project.findWithLeads();
}
