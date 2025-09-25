import type { Project } from "@/features/project/domain/models/Project";
import type { ProjectId } from "@/features/project/types";

import type { ProjectsAppContext } from "../../context";

export async function getProjectById(
  ctx: ProjectsAppContext,
  id: ProjectId
): Promise<Project | null> {
  return ctx.repos.project.findById(id);
}

