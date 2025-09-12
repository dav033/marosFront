import type { Contact } from '../entities/Contact';

export type ContactValidation = {
  nameAvailable: boolean;
  emailAvailable: boolean;
  phoneAvailable: boolean;
  nameReason?: string;
  emailReason?: string;
  phoneReason?: string;
};

export interface ContactRepositoryPort {
  list(): Promise<Contact[]>;
  getById(id: number): Promise<Contact>;
  create(contact: Contact): Promise<Contact>;
  update(id: number, patch: Partial<Contact>): Promise<Contact>;
  delete(id: number): Promise<void>;
  validateAvailability(params: { name?: string; email?: string; phone?: string; excludeId?: number }): Promise<ContactValidation>;
}