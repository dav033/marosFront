import type { Contacts, CreateContactRequest } from "src/types";
import { optimizedApiClient } from "src/lib/optimizedApiClient";

export const ContactsService = {
  async getAllContacts(): Promise<Contacts[]> {
  const response = await optimizedApiClient.get<Contacts[]>(`/contacts/all`);
  return response.data;
  },

  async getContactById(id: number): Promise<Contacts> {
  const response = await optimizedApiClient.get<Contacts>(`/contacts/${id}`);
  return response.data;
  },

  async createContact(contact: CreateContactRequest): Promise<Contacts> {
  const response = await optimizedApiClient.post<Contacts>(`/contacts`, contact);
  return response.data;
  },

  async updateContact(
    id: number,
    contact: Partial<Contacts>
  ): Promise<Contacts> {
  const response = await optimizedApiClient.put<Contacts>(`/contacts/${id}`, contact);
  return response.data;
  },

  async deleteContact(id: number): Promise<boolean> {
  const response = await optimizedApiClient.delete<boolean>(`/contacts/${id}`);
  return response.data;
  },
};
