import type { HttpClientLike } from '@/shared';
import { optimizedApiClient } from '@/shared';
import {
  makeResource,
  type Resource,
  type ResourceEndpoints,
  type ResourceMappers,
} from '@/shared';

export function makeCrudRepo<
  Api,
  Domain,
  CreateDTO = unknown,
  UpdateDTO = unknown,
  ID extends number | string = number,
>(
  endpoints: ResourceEndpoints<ID>,
  mappers: ResourceMappers<Api, Domain>,
  api: HttpClientLike = optimizedApiClient,
): Resource<ID, Domain, CreateDTO, UpdateDTO> {
  return makeResource<Api, Domain, CreateDTO, UpdateDTO, ID>(
    endpoints,
    mappers,
    api,
  );
}
