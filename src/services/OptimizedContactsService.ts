/**
 * Servicio de Contactos optimizado con cache y prefetch
 */

import { optimizedApiClient } from "src/lib/optimizedApiClient";
import type { Contacts, CreateContactRequest, ContactValidationResponse } from "src/types";
import type { DeleteContactResponse } from "../types/responses/deleteContact";

export const OptimizedContactsService = {
  async getAllContacts(): Promise<Contacts[]> {
    const response = await optimizedApiClient.get(`/contacts/all`, {
      cache: {
        enabled: true,
        ttl: 15 * 60 * 1000, // 15 minutos
        strategy: "cache-first",
      },
      prefetch: {
        enabled: true,
        priority: "medium",
      },
    });
    return response.data as Contacts[];
  },

  async getContactById(id: number): Promise<Contacts> {
    const response = await optimizedApiClient.get(`/contacts/${id}`, {
      cache: {
        enabled: true,
        ttl: 10 * 60 * 1000, // 10 minutos
        strategy: "cache-first",
      },
    });
    return response.data as Contacts;
  },

  async createContact(contact: CreateContactRequest): Promise<Contacts> {
    const response = await optimizedApiClient.post(`/contacts`, contact, {
      prefetch: {
        enabled: true,
        priority: "high",
        dependencies: ["/contacts/all"], // Refrescar lista de contactos
      },
    });
    return response.data as Contacts;
  },

  async updateContact(
    id: number,
    contact: Partial<Contacts>
  ): Promise<Contacts> {
    const response = await optimizedApiClient.put(`/contacts/${id}`, contact, {
      prefetch: {
        enabled: true,
        priority: "high",
        dependencies: ["/contacts/all"], // Refrescar lista de contactos
      },
    });
    return response.data as Contacts;
  },

  async validateContact(params: {
    name?: string;
    email?: string;
    phone?: string;
    excludeId?: number;
  }): Promise<ContactValidationResponse> {
    const response = await optimizedApiClient.get(`/contacts/validate`, {
      params,
      cache: { enabled: false },
    });
    return response.data as ContactValidationResponse;
  },

  async deleteContact(id: number): Promise<boolean> {
    const response = await optimizedApiClient.delete(`/contacts/${id}`, {
      prefetch: {
        enabled: true,
        priority: "high",
        dependencies: ["/contacts/all"], // Refrescar lista de contactos
      },
    });
    const data = response?.data as DeleteContactResponse;
    const okByStatus =
      typeof response?.status === "number" &&
      response.status >= 200 &&
      response.status < 300;
    const okByBody =
      typeof data === "object"
        ? !!(
            data &&
            ("deleted" in data
              ? data.deleted
              : "success" in data
                ? data.success
                : false)
          )
        : data === true;
    return okByStatus || okByBody;
  },

  // Métodos de prefetch específicos
  async prefetchAllContacts(): Promise<void> {
    await optimizedApiClient.prefetch("/contacts/all", {
      cache: { enabled: true, ttl: 15 * 60 * 1000 },
    });
  },

  async prefetchContact(id: number): Promise<void> {
    await optimizedApiClient.prefetch(`/contacts/${id}`, {
      cache: { enabled: true, ttl: 10 * 60 * 1000 },
    });
  },
};
