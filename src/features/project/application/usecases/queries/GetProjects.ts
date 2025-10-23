import type { Project } from "@/project";
import type { ProjectsAppContext } from "@/project";

export async function getProjects(ctx: ProjectsAppContext): Promise<Project[]> {
  return ctx.repos.project.findAll();
}