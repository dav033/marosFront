import { api, buildCrudEndpoints } from '@/shared';

const BASE = api.resource('projects');

export const projectEndpoints = {
  ...buildCrudEndpoints<number>(BASE),
  listByStatus: (status: string) =>
    `${BASE}/status?status=${encodeURIComponent(status)}`,
  withLeads: () => `${BASE}/with-leads`,
  count: () => `${BASE}/count`,
} as const;
