// src/features/contact/infra/http/endpoints.ts
import { buildCrudEndpoints } from "@/shared/infra/rest/buildCrudEndpoints";

const BASE = "/contacts";

/**
 * Mantiene EXACTAMENTE las mismas rutas que tenías:
 * - list():   /contacts/all
 * - create(): /contacts
 * - getById/update/remove: /contacts/:id
 * - uniquenessCheck(): /contacts/validate
 */
export const contactEndpoints = {
  ...buildCrudEndpoints<number>(BASE, {
    listPath: "/all",
    // createPath === undefined → create() => /contacts (igual que antes)
  }),
  uniquenessCheck: () => `${BASE}/validate`,
} as const;
