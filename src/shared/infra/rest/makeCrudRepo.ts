// src/shared/infra/rest/makeCrudRepo.ts
import type { HttpClientLike } from "@/shared/infra/http/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import { makeResource, type Resource, type ResourceEndpoints, type ResourceMappers } from "@/shared/infra/rest/makeResource";

/**
 * Capa muy fina sobre makeResource para crear un repo CRUD en 1 línea.
 */
export function makeCrudRepo<Api, Domain, CreateDTO = unknown, UpdateDTO = unknown, ID extends number|string = number>(
  endpoints: ResourceEndpoints<ID>,
  mappers: ResourceMappers<Api, Domain>,
  api: HttpClientLike = optimizedApiClient
): Resource<ID, Domain, CreateDTO, UpdateDTO> {
  return makeResource<Api, Domain, CreateDTO, UpdateDTO, ID>(endpoints, mappers, api);
}
