import type { Contact } from "@/features/contact/domain/models/Contact";
import {
  type CreateContactRequestDTO,
  type UpdateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactDTO";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { ContactRepositoryPort } from "../../domain/ports/ContactRepositoryPort";
import { contactEndpoints } from "./endpoints";
import { makeResource } from "@/shared/infra/rest/makeResource";

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

  // Extensión opcional fuera del CRUD estándar.
  async search?(query: string): Promise<Contact[]> {
    // Nota: conservamos este endpoint específico sin generalizar.
    const res = await optimizedApiClient.get("/contacts/search", {
      params: { q: query },
    });
    return (Array.isArray(res.data) ? res.data : []) as Contact[];
  }
}
