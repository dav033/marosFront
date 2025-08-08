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

export const validateEmail = (email: string): boolean => {
  if (!email) return true;
  return /\S+@\S+\.\S+/.test(email);
};

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

export const createLeadWithNewContact = async (
  data: CreateLeadByNewContactData
): Promise<Lead> => {
  return await LeadsService.createLeadByNewContact(data);
};

export const createLeadWithExistingContact = async (
  data: CreateLeadByExistingContactData
): Promise<Lead> => {
  return await LeadsService.createLeadByExistingContact(data);
};

export const updateLead = async (
  leadId: number,
  data: UpdateLeadData
): Promise<Lead> => {
  return await LeadsService.updateLead(leadId, data);
};

export const deleteLead = async (
  leadId: number
): Promise<{ success: boolean; message: string }> => {
  return await LeadsService.deleteLead(leadId);
};

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

export const getStatusOptions = () => [
  { value: "TO_DO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "LOST", label: "Lost" },
];

export const formatContactOptions = (contacts: any[]) => {
  return contacts.map((contact) => ({
    value: contact.id.toString(),
    label: contact.companyName
      ? `${contact.name} (${contact.companyName})`
      : contact.name || "No name",
  }));
};

export const formatProjectTypeOptions = (projectTypes: any[]) => {
  return projectTypes.map((pt) => ({
    value: pt.id.toString(),
    label: pt.name,
  }));
};
