// src/features/contact/application/ports/ContactRepositoryPort.ts

// Reutilizamos los DTO ya definidos en dominio (mappers)
import type { CreateContactRequestDTO } from "@/features/contact/domain/services/mapContactDraftToCreatePayload";
import type { UpdateContactRequestDTO } from "@/features/contact/domain/services/mapContactToUpdatePayload";

import type { Contact } from "../models/Contact";

/**
 * Puerto de repositorio para Contact.
 * Lo implementará un adapter HTTP (por ejemplo, ContactHttpRepository).
 */
export interface ContactRepositoryPort {
  create(payload: CreateContactRequestDTO): Promise<Contact>;
  update(id: number, payload: UpdateContactRequestDTO): Promise<Contact>;
  delete(id: number): Promise<void>;

  findById(id: number): Promise<Contact | null>;
  findAll(): Promise<Contact[]>;

  /** Opcional: búsqueda básica por texto en servidor. */
  search?(query: string): Promise<Contact[]>;
}
