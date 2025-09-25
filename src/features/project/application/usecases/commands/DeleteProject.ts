import type { ProjectId } from "@/features/project/types";

import type { ProjectsAppContext } from "../../context";

export async function deleteProject(
  ctx: ProjectsAppContext,
  id: ProjectId
): Promise<void> {
  return ctx.repos.project.delete(id);
}
