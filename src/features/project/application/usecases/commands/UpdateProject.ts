import type { Project, ProjectId, ProjectPatch } from "@/project";
import type { ProjectsAppContext } from "@/project";
import { ensureProjectIntegrity } from "@/project";

export async function updateProject(
  ctx: ProjectsAppContext,
  id: ProjectId,
  patch: ProjectPatch
): Promise<Project> {
  const updated = await ctx.repos.project.update(id, patch);
  ensureProjectIntegrity(updated);
  return updated;
}
