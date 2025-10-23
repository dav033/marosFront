import type { Project, ProjectStatus } from "@/project";
import type { ProjectsAppContext } from "@/project";

export async function getProjectsByStatus(
  ctx: ProjectsAppContext,
  status: ProjectStatus
): Promise<Project[]> {
  return ctx.repos.project.findByStatus(status);
}