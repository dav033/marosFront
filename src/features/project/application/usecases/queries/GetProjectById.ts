import type { Project, ProjectId } from "@/project";
import type { ProjectsAppContext } from "@/project";

export async function getProjectById(
  ctx: ProjectsAppContext,
  id: ProjectId
): Promise<Project | null> {
  return ctx.repos.project.findById(id);
}

