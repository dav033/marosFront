import { optimizedApiClient } from "@/lib/optimizedApiClient"; // ajusta la ruta si difiere

import type { Contacts } from "@/features/contact/domain/models/Contact";
import type {
  CreateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactDraftToCreatePayload";
import type {
  UpdateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactToUpdatePayload";
import type { ContactRepositoryPort } from "../../domain";

// Si ya tienes mapeadores de DTO ⇄ dominio, úsalos aquí.
// En caso contrario, dejamos los datos "as is" (backend ya devuelve la forma de Contacts).
// import { mapContactFromDTO } from "@/features/contact/domain/services/mapContactFromDTO";

export class ContactHttpRepository implements ContactRepositoryPort {
  async create(payload: CreateContactRequestDTO): Promise<Contacts> {
    const res = await optimizedApiClient.post("/contacts", payload);
    return res.data as Contacts; // o mapContactFromDTO(res.data)
  }

  async update(id: number, payload: UpdateContactRequestDTO): Promise<Contacts> {
    const res = await optimizedApiClient.put(`/contacts/${id}`, payload);
    return res.data as Contacts; // o mapContactFromDTO(res.data)
  }

  async delete(id: number): Promise<void> {
    await optimizedApiClient.delete(`/contacts/${id}`);
  }

  async getById(id: number): Promise<Contacts | null> {
    const res = await optimizedApiClient.get(`/contacts/${id}`);
    return (res.data ?? null) as Contacts; // o mapContactFromDTO(res.data)
  }

  async getAll(): Promise<Contacts[]> {
    // Con cache si tu cliente lo soporta
    const res = await optimizedApiClient.get("/contacts/all", {
      cache: { enabled: true, strategy: "cache-first", ttl: 5 * 60 * 1000 },
    });
    return (Array.isArray(res.data) ? res.data : []) as Contacts[];
  }

  async search?(query: string): Promise<Contacts[]> {
    const res = await optimizedApiClient.get("/contacts/search", {
      params: { q: query },
      cache: { enabled: true, strategy: "network-first", ttl: 60 * 1000 },
    });
    return (Array.isArray(res.data) ? res.data : []) as Contacts[];
  }
}
