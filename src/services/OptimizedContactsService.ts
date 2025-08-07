/**
 * Servicio de Contactos optimizado con cache y prefetch
 */

import type { Contacts, CreateContactRequest } from "../types/types";
import { optimizedApiClient } from "src/lib/optimizedApiClient";

export const OptimizedContactsService = {
  async getAllContacts(): Promise<Contacts[]> {
    const response = await optimizedApiClient.get(`/contacts/all`, {
      cache: {
        enabled: true,
        ttl: 15 * 60 * 1000, // 15 minutos
        strategy: 'cache-first'
      },
      prefetch: {
        enabled: true,
        priority: 'medium'
      }
    });
    return response.data;
  },

  async getContactById(id: number): Promise<Contacts> {
    const response = await optimizedApiClient.get(`/contacts/${id}`, {
      cache: {
        enabled: true,
        ttl: 10 * 60 * 1000, // 10 minutos
        strategy: 'cache-first'
      }
    });
    return response.data;
  },

  async createContact(contact: CreateContactRequest): Promise<Contacts> {
    const response = await optimizedApiClient.post(`/contacts`, contact, {
      prefetch: {
        enabled: true,
        priority: 'high',
        dependencies: ['/contacts/all'] // Refrescar lista de contactos
      }
    });
    return response.data;
  },

  async updateContact(id: number, contact: Partial<Contacts>): Promise<Contacts> {
    const response = await optimizedApiClient.put(`/contacts/${id}`, contact, {
      prefetch: {
        enabled: true,
        priority: 'high',
        dependencies: ['/contacts/all'] // Refrescar lista de contactos
      }
    });
    return response.data;
  },

  async deleteContact(id: number): Promise<boolean> {
    const response = await optimizedApiClient.delete(`/contacts/${id}`, {
      prefetch: {
        enabled: true,
        priority: 'high',
        dependencies: ['/contacts/all'] // Refrescar lista de contactos
      }
    });
    return response.data;
  },

  // Métodos de prefetch específicos
  async prefetchAllContacts(): Promise<void> {
    await optimizedApiClient.prefetch('/contacts/all', {
      cache: { enabled: true, ttl: 15 * 60 * 1000 }
    });
  },

  async prefetchContact(id: number): Promise<void> {
    await optimizedApiClient.prefetch(`/contacts/${id}`, {
      cache: { enabled: true, ttl: 10 * 60 * 1000 }
    });
  }
};
