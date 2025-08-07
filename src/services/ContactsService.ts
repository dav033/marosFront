import type { Contacts, CreateContactRequest } from "../types/types";
import apiClient from "src/lib/apiClient";

export const ContactsService = {
  async getAllContacts(): Promise<Contacts[]> {
    const response = await apiClient.get(`/contacts/all`);
    return response.data;
  },

  async getContactById(id: number): Promise<Contacts> {
    const response = await apiClient.get(`/contacts/${id}`);
    return response.data;
  },

  async createContact(contact: CreateContactRequest): Promise<Contacts> {
    const response = await apiClient.post(`/contacts`, contact);
    return response.data;
  },

  async updateContact(id: number, contact: Partial<Contacts>): Promise<Contacts> {
    const response = await apiClient.put(`/contacts/${id}`, contact);
    return response.data;
  },

  async deleteContact(id: number): Promise<boolean> {
    const response = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  },
};
