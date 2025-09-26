import type { CreateContactRequestDTO } from "@/features/contact/domain/services/mapContactDraftToCreatePayload";
import type { UpdateContactRequestDTO } from "@/features/contact/domain/services/mapContactToUpdatePayload";

import type { Contact } from "../models/Contact";

export interface ContactRepositoryPort {
  create(payload: CreateContactRequestDTO): Promise<Contact>;
  update(id: number, payload: UpdateContactRequestDTO): Promise<Contact>;
  delete(id: number): Promise<void>;

  findById(id: number): Promise<Contact | null>;
  findAll(): Promise<Contact[]>;

    search?(query: string): Promise<Contact[]>;
}
