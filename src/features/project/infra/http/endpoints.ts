// Centraliza rutas para /api/projects
export const PROJECTS_API = {
  base: "/api/projects",
  byId: (id: number) => `/api/projects/${id}`,
  byStatus: (status: string) => `/api/projects/status?status=${encodeURIComponent(status)}`,
  withLeads: "/api/projects/with-leads",
  count: "/api/projects/count",
};
