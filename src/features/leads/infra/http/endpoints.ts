// src/features/leads/infra/http/endpoints.ts

export const BASE = "/leads";

export const endpoints = {
  // Requeridos por makeResource
  base: BASE,
  list: () => BASE,
  create: () => BASE, // no lo usamos en Leads (por tener 2 variantes), pero lo dejamos por consistencia

  // CRUD clásico
  getById: (id: number) => `${BASE}/${id}`,
  update: (id: number) => `${BASE}/${id}`,
  remove: (id: number) => `${BASE}/${id}`,

  // Consultas específicas de Leads
  listByType: (type: string) => `${BASE}/type?type=${encodeURIComponent(type)}`,
  validateLeadNumber: (leadNumber: string) =>
    `${BASE}/validate?leadNumber=${encodeURIComponent(leadNumber)}`,

  // Creación con flujos diferenciados (evitamos strings "mágicos" en el repo)
  createWithNewContact: () => `${BASE}/new-contact`,
  createWithExistingContact: () => `${BASE}/existing-contact`,
} as const;
