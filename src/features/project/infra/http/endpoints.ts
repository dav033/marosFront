// src/features/project/infra/http/endpoints.ts
import { buildCrudEndpoints } from "@/shared/infra/rest/buildCrudEndpoints";

/** Export existente: se conserva tal cual para compatibilidad. */
export const PROJECTS_API = {
  base: "/api/projects",
  byId: (id: number) => `/api/projects/${id}`,
  byStatus: (status: string) => `/api/projects/status?status=${encodeURIComponent(status)}`,
  withLeads: "/api/projects/with-leads",
  count: "/api/projects/count",
} as const;

/** Endpoints CRUD generados + extras, para uso interno en el repo. */
export const projectEndpoints = {
  ...buildCrudEndpoints<number>(PROJECTS_API.base),
  listByStatus: (status: string) => PROJECTS_API.byStatus(status),
  withLeads: () => PROJECTS_API.withLeads,
  count: () => PROJECTS_API.count,
} as const;
