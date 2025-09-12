import type { Lead } from '../entities/Lead';
import type { LeadType } from '../enums/LeadType';

export type LeadNumberValidation = { valid: boolean; reason?: string };

export interface LeadRepositoryPort {
  list(type?: LeadType): Promise<Lead[]>;
  getById(id: number): Promise<Lead>;
  createWithExistingContact(input: Omit<Lead, 'id' | 'contact'> & { contactId: number }): Promise<Lead>;
  createWithNewContact(input: Omit<Lead, 'id' | 'contact'> & { contact: Lead['contact'] }): Promise<Lead>;
  update(id: number, patch: Partial<Lead>): Promise<Lead>;
  delete(id: number): Promise<void>;
  validateLeadNumber(leadNumber: string): Promise<LeadNumberValidation>;
}