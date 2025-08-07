/**
 * Servicio de Leads optimizado con cache y prefetch
 */

import type { Lead, CreateLeadByNewContactRequest, CreateLeadRequest, CreateContactRequest } from "../types/types";
import { LeadType, LeadStatus } from "src/types/enums";
import { optimizedApiClient } from "src/lib/optimizedApiClient";

export const OptimizedLeadsService = {
  async getLeadsByType(type: LeadType): Promise<Lead[]> {
    try {
      const response = await optimizedApiClient.get(`/leads/type?type=${type}`, {
        cache: {
          enabled: true,
          ttl: 15 * 60 * 1000, // 15 minutos
          strategy: 'cache-first'
        },
        prefetch: {
          enabled: true,
          priority: 'medium',
          dependencies: ['/contacts/all'] // Prefetch contacts relacionados
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in API getLeadsByType:', error);
      throw error;
    }
  },

  async createLeadByNewContact(leadData: {
    leadName: string;
    customerName: string;
    contactName: string;
    phone: string;
    email: string;
    projectTypeId: number;
    location: string;
    leadType: LeadType;
  }): Promise<Lead> {
    const contactRequest: CreateContactRequest = {
      companyName: leadData.customerName,
      name: leadData.contactName,
      phone: leadData.phone,
      email: leadData.email,
    };

    const leadRequest: CreateLeadRequest = {
      leadNumber: "",
      name: leadData.leadName,
      startDate: new Date().toISOString().split('T')[0],
      location: leadData.location,
      status: null,
      contact: contactRequest,
      projectType: {
        id: leadData.projectTypeId,
        name: "",
        color: "",
      },
      leadType: leadData.leadType,
    };

    const request: CreateLeadByNewContactRequest = {
      lead: leadRequest,
      contact: contactRequest,
    };

    const response = await optimizedApiClient.post(`/leads/new-contact`, request, {
      prefetch: {
        enabled: true,
        priority: 'high',
        dependencies: [`/leads/type`] // Refrescar lista de leads
      }
    });
    
    return response.data;
  },

  async createLeadByExistingContact(leadData: {
    leadName: string;
    contactId: number;
    projectTypeId: number;
    location: string;
    leadType: LeadType;
  }): Promise<Lead> {
    const leadRequest: CreateLeadRequest = {
      leadNumber: "",
      name: leadData.leadName,
      startDate: new Date().toISOString().split('T')[0],
      location: leadData.location,
      status: null,
      contact: undefined,
      projectType: {
        id: leadData.projectTypeId,
        name: "",
        color: "",
      },
      leadType: leadData.leadType,
    };

    const request = {
      lead: leadRequest,
      contactId: leadData.contactId,
    };

    const response = await optimizedApiClient.post(`/leads/existing-contact`, request, {
      prefetch: {
        enabled: true,
        priority: 'high',
        dependencies: [`/leads/type`] // Refrescar lista de leads
      }
    });
    
    return response.data;
  },

  async updateLead(leadId: number, leadData: {
    name?: string;
    location?: string;
    status?: string;
    contactId?: number;
    projectTypeId?: number;
    startDate?: string;
  }): Promise<Lead> {
    try {
      const updatedLead: Partial<CreateLeadRequest> = {};

      if (leadData.name !== undefined) updatedLead.name = leadData.name;
      if (leadData.location !== undefined) updatedLead.location = leadData.location;
      if (leadData.status !== undefined) updatedLead.status = leadData.status as LeadStatus;
      if (leadData.startDate !== undefined) updatedLead.startDate = leadData.startDate;

      if (leadData.projectTypeId !== undefined) {
        updatedLead.projectType = {
          id: leadData.projectTypeId,
          name: "",
          color: "",
        };
      }

      const request = {
        lead: updatedLead,
      };

      const response = await optimizedApiClient.put(`/leads/${leadId}`, request, {
        prefetch: {
          enabled: true,
          priority: 'high',
          dependencies: [`/leads/type`] // Refrescar lista de leads
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  async deleteLead(leadId: number): Promise<boolean> {
    try {
      const response = await optimizedApiClient.delete(`/leads/${leadId}`, {
        prefetch: {
          enabled: true,
          priority: 'high',
          dependencies: [`/leads/type`] // Refrescar lista de leads
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  // Métodos de prefetch específicos
  async prefetchLeadsByType(type: LeadType): Promise<void> {
    await optimizedApiClient.prefetch(`/leads/type?type=${type}`, {
      cache: { enabled: true, ttl: 15 * 60 * 1000 }
    });
  },

  async prefetchRelatedData(): Promise<void> {
    // Prefetch datos comunes que se usan junto con leads
    const prefetchPromises = [
      optimizedApiClient.prefetch('/contacts/all'),
      optimizedApiClient.prefetch('/project-types/all'),
    ];

    await Promise.allSettled(prefetchPromises);
  },

  // Configurar prefetch automático para navegación
  setupAutoPrefetech(): void {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    // Prefetch leads de construcción cuando se está en leads de plomería y viceversa
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('plumbing')) {
      this.prefetchLeadsByType(LeadType.CONSTRUCTION);
    } else if (currentPath.includes('construction')) {
      this.prefetchLeadsByType(LeadType.PLUMBING);
    } else if (currentPath.includes('roofing')) {
      this.prefetchLeadsByType(LeadType.CONSTRUCTION);
    }
  }
};

// Configurar prefetch automático al cargar
if (typeof window !== 'undefined') {
  OptimizedLeadsService.setupAutoPrefetech();
}
