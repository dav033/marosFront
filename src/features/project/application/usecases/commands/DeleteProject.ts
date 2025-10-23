import type { ProjectId } from "@/project";
import type { ProjectsAppContext } from "@/project";

export async function deleteProject(
  ctx: ProjectsAppContext,
  id: ProjectId
): Promise<void> {
  return ctx.repos.project.delete(id);
}
