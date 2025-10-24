import type { HttpClientLike } from '@/shared';
import { optimizedApiClient } from '@/shared';

export type ResourceEndpoints<ID = number | string> = Readonly<{
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

export type UpdatePolicy = 'require-body' | 'no-body-ok';

export type MakeResourceOptions = Readonly<{
  updatePolicy?: UpdatePolicy;
}>;

export interface Resource<ID, Domain, CreateDTO, UpdateDTO> {
  findById(id: ID): Promise<Domain | null>;
  findAll(): Promise<Domain[]>;
  create(dto: CreateDTO): Promise<Domain>;
  update(id: ID, dto: UpdateDTO): Promise<Domain | null>;
  delete(id: ID): Promise<void>;
}

export function makeResource<
  Api,
  Domain,
  CreateDTO = unknown,
  UpdateDTO = unknown,
  ID = number | string,
>(
  endpoints: ResourceEndpoints<ID>,
  mappers: ResourceMappers<Api, Domain>,
  api: HttpClientLike = optimizedApiClient,
  options: MakeResourceOptions = {},
) {
  const { updatePolicy = 'require-body' } = options;
  const fromApi = mappers.fromApi;
  const fromApiList = mappers.fromApiList ?? ((arr: Api[]) => arr.map(fromApi));

  return {
    async findById(id: ID) {
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
      if (!data) throw new Error('Empty response on create');
      return fromApi(data);
    },

    async update(id: ID, dto: UpdateDTO) {
      const res = await api.put<Api | null | undefined>(
        endpoints.update(id),
        dto as unknown,
      );
      if (res?.data) return fromApi(res.data as Api);

      if (updatePolicy === 'require-body') {
        throw new Error('Empty response on update');
      }
      return null;
    },

    async delete(id: ID) {
      await api.delete<void>(endpoints.remove(id));
    },
  };
}
