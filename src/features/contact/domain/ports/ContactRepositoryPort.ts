import type { Contact } from "@/contact";
import type { CreateContactRequestDTO, UpdateContactRequestDTO } from "@/contact";

export interface ContactRepositoryPort {
  create(payload: CreateContactRequestDTO): Promise<Contact>;
  update(id: number, payload: UpdateContactRequestDTO): Promise<Contact>;
  delete(id: number): Promise<void>;

  findById(id: number): Promise<Contact | null>;
  findAll(): Promise<Contact[]>;

  search?(query: string): Promise<Contact[]>;
}
