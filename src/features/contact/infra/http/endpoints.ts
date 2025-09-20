// src/features/contact/infra/http/endpoints.ts

export const contactEndpoints = {
  base: "/contacts",
  getById: (id: number) => `/contacts/${id}`,
  // ⬇️ En el origen la lista es /contacts/all
  list: () => `/contacts/all`,
  // (No hay /contacts?search=... en el backend de origen)
  create: () => `/contacts`,
  update: (id: number) => `/contacts/${id}`,
  remove: (id: number) => `/contacts/${id}`,

  // Validación de unicidad (GET con query)
  uniquenessCheck: () => `/contacts/validate`,
};
