// src/shared/infra/rest/buildCrudEndpoints.ts
import type { ResourceEndpoints } from "@/shared/infra/rest/makeResource";

/** Builder simple para endpoints CRUD coherentes. */
export function buildCrudEndpoints<ID extends string | number>(
  base: string,
  options?: {
    listPath?: string;            // e.g. "/all"
    createPath?: string;          // e.g. "/create"
    byIdPath?: (id: ID) => string; // si no es "/:id"
  }
): ResourceEndpoints<ID> {
  const list = () => (options?.listPath ? `${base}${options.listPath}` : base);
  const create = () => (options?.createPath ? `${base}${options.createPath}` : base);
  const byId = (id: ID) => (options?.byIdPath ? options.byIdPath(id) : `${base}/${id}`);

  return {
    base,
    list,
    create,
    getById: byId,
    update: byId,
    remove: byId,
  };
}
