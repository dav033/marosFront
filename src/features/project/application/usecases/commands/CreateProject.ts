import type { Project } from "@/features/project/domain/models/Project";
import { ensureProjectIntegrity } from "@/features/project/domain/services/ensureProjectIntegrity";
import type { ProjectDraft } from "@/features/project/types";

import type { ProjectsAppContext } from "../../context";

export async function createProject(
  ctx: ProjectsAppContext,
  draft: ProjectDraft
): Promise<Project> {
  const created = await ctx.repos.project.saveNew(draft);
  ensureProjectIntegrity(created);
  return created;
}
