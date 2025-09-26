
export const contactEndpoints = {
  base: "/contacts",
  getById: (id: number) => `/contacts/${id}`,
  list: () => `/contacts/all`,
  create: () => `/contacts`,
  update: (id: number) => `/contacts/${id}`,
  remove: (id: number) => `/contacts/${id}`,
  uniquenessCheck: () => `/contacts/validate`,
};
