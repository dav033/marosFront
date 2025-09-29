import type { Contact } from "@/features/contact/domain/models/Contact";
import type { CreateContactRequestDTO } from "@/features/contact/domain/services/mapContactDraftToCreatePayload";
import type { UpdateContactRequestDTO } from "@/features/contact/domain/services/mapContactToUpdatePayload";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

import type { ContactRepositoryPort } from "../../domain";

export class ContactHttpRepository implements ContactRepositoryPort {
  async create(payload: CreateContactRequestDTO): Promise<Contact> {
    const res = await optimizedApiClient.post("/contacts", payload);
    return res.data as Contact; 
  }

  async update(id: number, payload: UpdateContactRequestDTO): Promise<Contact> {
    const res = await optimizedApiClient.put(`/contacts/${id}`, payload);
    return res.data as Contact; 
  }

  async delete(id: number): Promise<void> {
    await optimizedApiClient.delete(`/contacts/${id}`);
  }

  async findById(id: number): Promise<Contact | null> {
    const res = await optimizedApiClient.get(`/contacts/${id}`);
    return (res.data ?? null) as Contact; 
  }

  async findAll(): Promise<Contact[]> {
    const res = await optimizedApiClient.get("/contacts/all", {
      cache: { enabled: true, strategy: "cache-first", ttl: 5 * 60 * 1000 },
    });
    return (Array.isArray(res.data) ? res.data : []) as Contact[];
  }

  async search?(query: string): Promise<Contact[]> {
    const res = await optimizedApiClient.get("/contacts/search", {
      params: { q: query },
      cache: { enabled: true, strategy: "network-first", ttl: 60 * 1000 },
    });
    return (Array.isArray(res.data) ? res.data : []) as Contact[];
  }
}
