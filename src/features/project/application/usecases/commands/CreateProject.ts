import type { Project, ProjectDraft } from "@/project";
import type { ProjectsAppContext } from "@/project";
import { ensureProjectIntegrity } from "@/project";

export async function createProject(
  ctx: ProjectsAppContext,
  draft: ProjectDraft
): Promise<Project> {
  const created = await ctx.repos.project.saveNew(draft);
  ensureProjectIntegrity(created);
  return created;
}
