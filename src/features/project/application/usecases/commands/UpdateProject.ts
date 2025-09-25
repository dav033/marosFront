import type { Project } from "@/features/project/domain/models/Project";
import { ensureProjectIntegrity } from "@/features/project/domain/services/ensureProjectIntegrity";
import type { ProjectId, ProjectPatch } from "@/features/project/types";

import type { ProjectsAppContext } from "../../context";

export async function updateProject(
  ctx: ProjectsAppContext,
  id: ProjectId,
  patch: ProjectPatch
): Promise<Project> {
  const updated = await ctx.repos.project.update(id, patch);
  ensureProjectIntegrity(updated);
  return updated;
}
