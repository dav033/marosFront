// src/features/contact/infra/http/ContactHttpRepository.ts
import type { Contact } from "@/features/contact/domain/models/Contact";
import {
  type CreateContactRequestDTO,
  type UpdateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactDTO";
import type { ContactRepositoryPort } from "@/features/contact/domain/ports/ContactRepositoryPort";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import { makeResource } from "@/shared/infra/rest/makeResource";
// (opcional) Si prefieres la factory:
// import { makeCrudRepo } from "@/shared/infra/rest/makeCrudRepo";
import { contactEndpoints } from "./endpoints";

export class ContactHttpRepository implements ContactRepositoryPort {
  private resource = makeResource<Contact, Contact, CreateContactRequestDTO, UpdateContactRequestDTO, number>(
    contactEndpoints,
    {
      // El backend ya devuelve la forma de dominio para Contact.
      fromApi: (dto) => dto,
    }
  );

  create(payload: CreateContactRequestDTO): Promise<Contact> {
    return this.resource.create(payload);
  }

  update(id: number, payload: UpdateContactRequestDTO): Promise<Contact> {
    return this.resource.update(id, payload);
  }

  delete(id: number): Promise<void> {
    return this.resource.delete(id);
  }

  findById(id: number): Promise<Contact | null> {
    return this.resource.findById(id);
  }

  findAll(): Promise<Contact[]> {
    return this.resource.findAll();
  }

  // Extensión fuera del CRUD estándar.
  async search?(query: string): Promise<Contact[]> {
    const res = await optimizedApiClient.get("/contacts/search", {
      params: { q: query },
    });
    return (Array.isArray(res.data) ? res.data : []) as Contact[];
  }
}
