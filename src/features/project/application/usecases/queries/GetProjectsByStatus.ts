import type { Project } from "@/features/project/domain/models/Project";
import type { ProjectStatus } from "@/features/project/enums";

import type { ProjectsAppContext } from "../../context";

export async function getProjectsByStatus(
  ctx: ProjectsAppContext,
  status: ProjectStatus
): Promise<Project[]> {
  return ctx.repos.project.findByStatus(status);
}