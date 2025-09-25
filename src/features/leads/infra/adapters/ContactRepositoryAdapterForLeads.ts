// src/features/leads/infra/adapters/ContactRepositoryAdapterForLeads.ts
import { ContactHttpRepository } from "@/features/contact/infra";
import type { CreateContactRequestDTO } from "@/features/contact/domain/services/mapContactDraftToCreatePayload";

/**
 * Adaptador mínimo para el contexto de Leads.
 * Expone el método `saveNew(...)` que algunos builders/UC de Leads esperan,
 * delegando en ContactHttpRepository.create(...) y devolviendo el ID.
 */
export class ContactRepositoryAdapterForLeads {
  private http = new ContactHttpRepository();

  /**
   * Crea el contacto en backend y devuelve su ID numérico.
   * Ajuste el acceso a la propiedad `id` si su modelo difiere.
   */
  async saveNew(payload: CreateContactRequestDTO): Promise<number> {
    const created = await this.http.create(payload);
    // Asumimos que Contact tiene `id: number`
    return (created as any).id as number;
  }
}
