import type { Contact } from "@/contact";
import type { ContactRepositoryPort } from "@/contact";
import { type CreateContactRequestDTO, type UpdateContactRequestDTO } from "@/contact";
import { type HttpClientLike,makeCrudRepo, optimizedApiClient } from "@/shared";

import { contactEndpoints } from "./endpoints";

/**
 * Implementación mínima basada en la factory CRUD.
 * Mantiene el mismo nombre de clase y firma exigidos por ContactRepositoryPort.
 */
export class ContactHttpRepository implements ContactRepositoryPort {
  private readonly api: HttpClientLike;
  private readonly repo: ReturnType<
    typeof makeCrudRepo<Contact, Contact, CreateContactRequestDTO, UpdateContactRequestDTO, number>
  >;

  constructor(api: HttpClientLike = optimizedApiClient) {
    this.api = api;
    this.repo = makeCrudRepo<Contact, Contact, CreateContactRequestDTO, UpdateContactRequestDTO, number>(
      contactEndpoints,
      {
        fromApi: (dto) => dto,
        fromApiList: (list) => list,
      },
      this.api
    );
  }

  create(payload: CreateContactRequestDTO): Promise<Contact> {
    return this.repo.create(payload);
  }

  update(id: number, payload: UpdateContactRequestDTO): Promise<Contact> {
    return this.repo.update(id, payload);
  }

  delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  findById(id: number): Promise<Contact | null> {
    return this.repo.findById(id);
  }

  findAll(): Promise<Contact[]> {
    return this.repo.findAll();
  }

    async search?(query: string): Promise<Contact[]> {
    const { data } = await this.api.get<Contact[]>("/contacts/search", {
      params: { q: query },
    });
    return Array.isArray(data) ? data : [];
  }
}
