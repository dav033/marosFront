import type { HttpClientLike } from "@/shared/infra/http/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

export type ResourceEndpoints<ID = number | string> = Readonly<{
  /** Base path, e.g. "/contacts" (used when list() is not provided). */
  base: string;
  getById: (id: ID) => string;
  list?: () => string;
  create: () => string;
  update: (id: ID) => string;
  remove: (id: ID) => string;
}>;

export type ResourceMappers<Api, Domain> = Readonly<{
  fromApi: (dto: Api) => Domain;
  fromApiList?: (list: Api[]) => Domain[];
}>;

export interface Resource<ID, Domain, CreateDTO, UpdateDTO> {
  findById(id: ID): Promise<Domain | null>;
  findAll(): Promise<Domain[]>;
  create(dto: CreateDTO): Promise<Domain>;
  update(id: ID, dto: UpdateDTO): Promise<Domain>;
  delete(id: ID): Promise<void>;
}

export function makeResource<Api, Domain, CreateDTO = unknown, UpdateDTO = unknown, ID = number | string>(
  endpoints: ResourceEndpoints<ID>,
  mappers: ResourceMappers<Api, Domain>,
  api: HttpClientLike = optimizedApiClient
): Resource<ID, Domain, CreateDTO, UpdateDTO> {
  const fromApi = mappers.fromApi;
  const fromApiList = mappers.fromApiList ?? ((arr: Api[]) => arr.map(fromApi));

  return {
    async findById(id) {
      const { data } = await api.get<Api>(endpoints.getById(id));
      return data ? fromApi(data) : null;
    },
    async findAll() {
      const listUrl = endpoints.list ? endpoints.list() : endpoints.base;
      const { data } = await api.get<Api[] | undefined>(listUrl);
      return Array.isArray(data) ? fromApiList(data as Api[]) : [];
    },
    async create(dto: CreateDTO) {
      const { data } = await api.post<Api>(endpoints.create(), dto as unknown);
      if (!data) throw new Error("Empty response on create");
      return fromApi(data);
    },
    async update(id, dto: UpdateDTO) {
      const { data } = await api.put<Api>(endpoints.update(id), dto as unknown);
      if (!data) {
        const reloaded = await this.findById(id as ID);
        if (!reloaded) throw new Error("Resource not found after update");
        return reloaded;
      }
      return fromApi(data);
    },
    async delete(id) {
      await api.delete<void>(endpoints.remove(id));
    },
  };
}
