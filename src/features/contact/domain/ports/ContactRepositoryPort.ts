// src/features/contact/application/ports/ContactRepositoryPort.ts

import type { Contacts } from "../models/Contact";

// Reutilizamos los DTO ya definidos en dominio (mappers)
import type { CreateContactRequestDTO } from "@/features/contact/domain/services/mapContactDraftToCreatePayload";
import type { UpdateContactRequestDTO } from "@/features/contact/domain/services/mapContactToUpdatePayload";

/**
 * Puerto de repositorio para Contacts.
 * Lo implementará un adapter HTTP (por ejemplo, ContactHttpRepository).
 */
export interface ContactRepositoryPort {
  create(payload: CreateContactRequestDTO): Promise<Contacts>;
  update(id: number, payload: UpdateContactRequestDTO): Promise<Contacts>;
  delete(id: number): Promise<void>;

  getById(id: number): Promise<Contacts | null>;
  getAll(): Promise<Contacts[]>;

  /** Opcional: búsqueda básica por texto en servidor. */
  search?(query: string): Promise<Contacts[]>;
}
