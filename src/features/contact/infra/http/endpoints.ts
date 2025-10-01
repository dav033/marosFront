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
      }),
  uniquenessCheck: () => `${BASE}/validate`,
} as const;
