import type { LeadsAppContext, ProjectType } from "@/leads";

export async function listProjectTypes(ctx: LeadsAppContext): Promise<ProjectType[]> {
  const repo = ctx?.repos?.projectType;
  if (!repo) throw new Error("ProjectType repository not configured in LeadsAppContext");
  const items = await repo.findAll();
  return Array.isArray(items) ? items : [];
}
