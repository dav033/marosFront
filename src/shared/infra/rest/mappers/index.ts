// src/shared/infra/rest/mappers/index.ts

export type FromApi<Api, Domain> = (dto: Api) => Domain;
export type FromApiList<Api, Domain> = (list: Api[]) => Domain[];
export type ToCreate<Draft, CreateDTO> = (draft: Draft) => CreateDTO;
export type ToUpdate<Patch, UpdateDTO> = (patch: Patch) => UpdateDTO;

/** Helper: genera un fromApiList a partir de un fromApi */
export const fromList =
  <Api, Domain>(fromApi: FromApi<Api, Domain>): FromApiList<Api, Domain> =>
  (list: Api[]) =>
    Array.isArray(list) ? list.map(fromApi) : [];
