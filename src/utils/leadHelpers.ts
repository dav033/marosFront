import { LeadsService } from "@services/LeadsService";
import type { Lead } from "src/types";
import { LeadType } from "src/types/enums";

export interface CreateLeadByNewContactData {
  leadName: string;
  customerName: string;
  contactName: string;
  phone: string;
  email: string;
  projectTypeId: number;
  location: string;
  leadType: LeadType;
}

export interface CreateLeadByExistingContactData {
  leadName: string;
  contactId: number;
  projectTypeId: number;
  location: string;
  leadType: LeadType;
}

export interface UpdateLeadData {
  name?: string;
  location?: string;
  status?: string;
  contactId?: number;
  projectTypeId?: number;
  startDate?: string;
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return true; // Empty email is valid
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * Validates required fields for creating a new lead with new contact
 */
export const validateNewContactLead = (data: {
  leadName: string;
  customerName: string;
  contactName: string;
  projectTypeId: string;
  email?: string;
}): string | null => {
  if (!data.leadName || !data.projectTypeId) {
    return "Please complete the required fields: Lead Name and Project Type";
  }

  if (!data.customerName || !data.contactName) {
    return "Please complete Customer Name and Contact Name to create a new contact";
  }

  if (data.email && !validateEmail(data.email)) {
    return "Please enter a valid email";
  }

  return null;
};

/**
 * Validates required fields for creating a new lead with existing contact
 */
export const validateExistingContactLead = (data: {
  leadName: string;
  contactId: string;
  projectTypeId: string;
}): string | null => {
  if (!data.leadName || !data.projectTypeId) {
    return "Please complete the required fields: Lead Name and Project Type";
  }

  if (!data.contactId) {
    return "Please select an existing contact";
  }

  return null;
};

/**
 * Validates required fields for editing a lead
 */
export const validateEditLead = (data: {
  projectTypeId: string;
  contactId: string;
}): string | null => {
  if (!data.projectTypeId) {
    return "Please select a project type";
  }

  if (!data.contactId) {
    return "Please select a contact";
  }

  return null;
};

/**
 * Creates a new lead with a new contact
 */
export const createLeadWithNewContact = async (
  data: CreateLeadByNewContactData
): Promise<Lead> => {
  return await LeadsService.createLeadByNewContact(data);
};

/**
 * Creates a new lead with an existing contact
 */
export const createLeadWithExistingContact = async (
  data: CreateLeadByExistingContactData
): Promise<Lead> => {
  return await LeadsService.createLeadByExistingContact(data);
};

/**
 * Updates an existing lead
 */
export const updateLead = async (
  leadId: number,
  data: UpdateLeadData
): Promise<Lead> => {
  return await LeadsService.updateLead(leadId, data);
};

/**
 * Deletes a lead by ID
 */
export const deleteLead = async (
  leadId: number
): Promise<{ success: boolean; message: string }> => {
  return await LeadsService.deleteLead(leadId);
};

/**
 * Formats lead initial data for editing
 */
export const formatLeadForEdit = (lead: Lead | null) => {
  if (!lead) return {};

  return {
    leadName: lead.name || "",
    location: lead.location || "",
    status: lead.status || "",
    contactId: lead.contact?.id?.toString() || "",
    projectTypeId: lead.projectType?.id?.toString() || "",
    startDate: lead.startDate ? lead.startDate.split("T")[0] : "",
  };
};

/**
 * Status options for dropdowns
 */
export const getStatusOptions = () => [
  { value: "TO_DO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "LOST", label: "Lost" },
];

/**
 * Formats contact options for dropdowns
 */
export const formatContactOptions = (contacts: any[]) => {
  return contacts.map((contact) => ({
    value: contact.id.toString(),
    label: contact.companyName
      ? `${contact.name} (${contact.companyName})`
      : contact.name || "No name",
  }));
};

/**
 * Formats project type options for dropdowns
 */
export const formatProjectTypeOptions = (projectTypes: any[]) => {
  return projectTypes.map((pt) => ({
    value: pt.id.toString(),
    label: pt.name,
  }));
};
