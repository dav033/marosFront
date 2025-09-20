import type { Lead } from "@/features/leads/domain/models/Lead";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import type { ProjectType } from "@/features/leads/domain/models/ProjectType";
import { LeadHttpRepository } from "@/features/leads/infra/http/LeadHttpRepository";
import { LeadType } from "@/features/leads/enums";
import { optimizedApiClient } from "@/lib/optimizedApiClient";

const leadRepo = new LeadHttpRepository(optimizedApiClient);

export const OptimizedLeadsService = {
  async getLeadsByType(type: LeadType): Promise<Lead[]> {
    try {
      return await leadRepo.findByType(type);
    } catch (error) {
      console.error("Error in API getLeadsByType:", error);
      throw error;
    }
  },

  // Placeholder methods - implement as needed
  async createLeadByNewContact(data: unknown): Promise<Lead> {
    throw new Error("Method not implemented yet");
  },

  async createLeadByExistingContact(data: unknown): Promise<Lead> {
    throw new Error("Method not implemented yet");
  },

  async updateLead(leadId: number, data: unknown): Promise<Lead> {
    throw new Error("Method not implemented yet");
  },

  async deleteLead(leadId: number): Promise<boolean> {
    throw new Error("Method not implemented yet");
  },

  async getContacts(): Promise<Contacts[]> {
    console.log('🔍 OptimizedLeadsService.getContacts() called');
    try {
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
      const contacts = response.data as Contacts[];
      console.log('✅ OptimizedLeadsService.getContacts() success:', contacts.length, 'contacts');
      return contacts;
    } catch (error) {
      console.error('❌ OptimizedLeadsService.getContacts() error:', error);
      throw error;
    }
  },

  async getProjectTypes(): Promise<ProjectType[]> {
    console.log('🔍 OptimizedLeadsService.getProjectTypes() called');
    try {
      const response = await optimizedApiClient.get<ProjectType[]>(`/project-types/all`);
      const projectTypes = response.data;
      console.log('✅ OptimizedLeadsService.getProjectTypes() success:', projectTypes.length, 'project types');
      return projectTypes;
    } catch (error) {
      console.error('❌ OptimizedLeadsService.getProjectTypes() error:', error);
      throw error;
    }
  },

  async createLeadLocalByNewContact(data: unknown): Promise<Lead> {
    throw new Error("Method not implemented yet");
  },

  async createLeadLocalByExistingContact(data: unknown): Promise<Lead> {
    throw new Error("Method not implemented yet");
  },

  async prefetchLeadsData(type?: LeadType): Promise<void> {
    // Empty implementation
  },

  setupAutoPrefetch(): void {
    // Empty implementation
  }
};