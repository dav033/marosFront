// src/features/leads/infra/http/endpoints.ts

export const BASE = "/leads";

export const endpoints = {
  getById: (id: number) => `${BASE}/${id}`,
  listByType: (type: string) => `${BASE}/type?type=${encodeURIComponent(type)}`,
  create: () => BASE,
  update: (id: number) => `${BASE}/${id}`,
  remove: (id: number) => `${BASE}/${id}`,

  // Ajusta si tu backend usa otra ruta para validar números
  validateLeadNumber: (leadNumber: string) =>
    `${BASE}/validate?leadNumber=${encodeURIComponent(leadNumber)}`,
} as const;
