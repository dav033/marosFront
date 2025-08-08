import type {
  Lead,
  CreateLeadByNewContactRequest,
  CreateLeadRequest,
  CreateContactRequest,
} from "src/types/types";
import { LeadType, LeadStatus } from "src/types/enums";
import apiClient from "src/lib/apiClient";

export const LeadsService = {
  async getLeadsByType(type: LeadType): Promise<Lead[]> {
    try {
      const response = await apiClient.post(`/leads/type`, { type });
      return response.data;
    } catch (error) {
      console.error("Error in API getLeadsByType:", error);
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
    leadType: LeadType; // Required - no default
  }): Promise<Lead> {
    const contactRequest: CreateContactRequest = {
      companyName: leadData.customerName,
      name: leadData.contactName,
      phone: leadData.phone,
      email: leadData.email,
      occupation: "",
      product: "",
      address: "",
      lastContact: new Date().toISOString(),
    };

    const leadRequest: CreateLeadRequest = {
      leadNumber: "",
      name: leadData.leadName,
      startDate: new Date().toISOString().split("T")[0],
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

    const response = await apiClient.post(`/leads/new-contact`, request);
    return response.data;
  },

  async createLeadByExistingContact(leadData: {
    leadName: string;
    contactId: number;
    projectTypeId: number;
    location: string;
    leadType: LeadType; // Required - no default
  }): Promise<Lead> {
    const leadRequest: CreateLeadRequest = {
      leadNumber: "",
      name: leadData.leadName,
      startDate: new Date().toISOString().split("T")[0],
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

    const response = await apiClient.post(`/leads/existing-contact`, request);
    return response.data;
  },

  async deleteLead(
    leadId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/leads/${leadId}`);
      return {
        success: true,
        message: response.data || "Lead deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting lead:", error);
      return {
        success: false,
        message: "Error deleting lead",
      };
    }
  },

  async updateLead(
    leadId: number,
    leadData: {
      name?: string;
      location?: string;
      status?: string;
      contactId?: number;
      projectTypeId?: number;
      startDate?: string;
    }
  ): Promise<Lead> {
    try {
      // Crear el objeto lead con los datos actualizados
      const updatedLead: Partial<CreateLeadRequest> = {};

      if (leadData.name !== undefined) updatedLead.name = leadData.name;
      if (leadData.location !== undefined)
        updatedLead.location = leadData.location;
      if (leadData.status !== undefined)
        updatedLead.status = leadData.status as any;
      if (leadData.startDate !== undefined)
        updatedLead.startDate = leadData.startDate;

      if (leadData.contactId !== undefined) {
        updatedLead.contact = { id: leadData.contactId } as any;
      }

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

      const response = await apiClient.put(`/leads/${leadId}`, request);
      return response.data;
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  },
};
