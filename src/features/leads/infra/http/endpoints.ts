import { buildCrudEndpoints } from "@/shared";

export const BASE = '/leads';

/** CRUD + endpoints específicos de Leads (rutas reales del proyecto). */
export const endpoints = {
  ...buildCrudEndpoints<number>(BASE),   listByType: (type: string) => `${BASE}/type?type=${encodeURIComponent(type)}`,
  validateLeadNumber: (leadNumber: string) =>
    `${BASE}/validate?leadNumber=${encodeURIComponent(leadNumber)}`,
  createWithNewContact: () => `${BASE}/new-contact`,
  createWithExistingContact: () => `${BASE}/existing-contact`,
} as const;
