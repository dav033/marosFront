import { OptimizedLeadsService as LeadsService } from "../services/OptimizedLeadsService";
import type { Lead, CreateLeadByNewContactData, CreateLeadByExistingContactData, UpdateLeadData, Contacts, ProjectType } from "src/types";
import type { 
  ValidateNewContactLeadData, 
  ValidateExistingContactLeadData, 
  ValidateEditLeadData, 
  LeadForEdit,
  SelectOption,
  StatusOption 
} from "src/types/utils/validation";
import { LeadType, LeadStatus } from "src/types/enums";

export const validateEmail = (email: string): boolean => {
  if (!email) return true;
  return /\S+@\S+\.\S+/.test(email);
};

export const validateNewContactLead = (data: ValidateNewContactLeadData): string | null => {
  if (data.leadNumber && data.leadNumber.trim().length < 3) {
    return "Lead Number is too short";
  }
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

export const validateExistingContactLead = (data: ValidateExistingContactLeadData): string | null => {
  if (data.leadNumber && data.leadNumber.trim().length < 3) {
    return "Lead Number is too short";
  }
  if (!data.leadName || !data.projectTypeId) {
    return "Please complete the required fields: Lead Name and Project Type";
  }

  if (!data.contactId) {
    return "Please select an existing contact";
  }

  return null;
};

export const validateEditLead = (data: ValidateEditLeadData): string | null => {
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
  const result = await LeadsService.deleteLead(leadId);
  return {
    success: result,
    message: result ? "Lead deleted successfully" : "Failed to delete lead",
  };
};

export const formatLeadForEdit = (lead: LeadForEdit | null) => {
  if (!lead) return {};

  return {
    leadName: lead.name || "",
    location: lead.location || "",
    status: lead.status || null,
    contactId: lead.contact?.id || undefined,
    projectTypeId: lead.projectType?.id || undefined,
    startDate: lead.startDate ? lead.startDate.split("T")[0] : "",
  };
};

export const getStatusOptions = (): StatusOption[] => [
  { value: "TO_DO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "LOST", label: "Lost" },
];

export const formatContactOptions = (contacts: Contacts[]): SelectOption[] => {
  return contacts.map((contact) => ({
    value: contact.id.toString(),
    label: contact.companyName
      ? `${contact.name} (${contact.companyName})`
      : contact.name || "No name",
  }));
};

export const formatProjectTypeOptions = (projectTypes: ProjectType[]): SelectOption[] => {
  return projectTypes.map((pt) => ({
    value: pt.id.toString(),
    label: pt.name,
  }));
};
