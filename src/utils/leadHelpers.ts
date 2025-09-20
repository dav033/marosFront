import type { CreateLeadByNewContactData, CreateLeadByExistingContactData, UpdateLeadData } from "@/types";
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import type { ProjectType } from "@/features/leads/domain/models/ProjectType";
import type {
  ValidateNewContactLeadData,
  ValidateExistingContactLeadData,
  ValidateEditLeadData,
  LeadForEdit,
  SelectOption,
  StatusOption,
} from "@/types/utils/validation";
import { optimizedApiClient } from "@/lib/optimizedApiClient";
import { LeadStatus } from "@/features/leads/enums";

// -------------------------
// Validaciones y formateos
// -------------------------
export const validateEmail = (email: string): boolean => {
  if (!email) return true;
  return /\S+@\S+\.\S+/.test(email);
};

export const validateNewContactLead = (data: ValidateNewContactLeadData): string | null => {
  if (data.leadNumber && data.leadNumber.trim().length < 3) return "Lead Number is too short";
  if (!data.leadName || !data.projectTypeId) return "Please complete the required fields: Lead Name and Project Type";
  if (!data.customerName || !data.contactName) return "Please complete Customer Name and Contact Name to create a new contact";
  if (data.email && !validateEmail(data.email)) return "Please enter a valid email";
  return null;
};

export const validateExistingContactLead = (data: ValidateExistingContactLeadData): string | null => {
  if (data.leadNumber && data.leadNumber.trim().length < 3) return "Lead Number is too short";
  if (!data.leadName || !data.projectTypeId) return "Please complete the required fields: Lead Name and Project Type";
  if (!data.contactId) return "Please select an existing contact";
  return null;
};

export const validateEditLead = (data: ValidateEditLeadData): string | null => {
  if (!data.projectTypeId) return "Please select a project type";
  if (!data.contactId) return "Please select a contact";
  return null;
};

export const formatLeadForEdit = (lead: LeadForEdit | null) => {
  if (!lead) return {};
  return {
    leadName: lead.name || "",
    location: lead.location || "",
    status: lead.status ?? null,
    contactId: lead.contact?.id ?? undefined,
    projectTypeId: lead.projectType?.id ?? undefined,
    startDate: lead.startDate ? lead.startDate.split("T")[0] : "",
  };
};

export const getStatusOptions = (): StatusOption[] => [
  { value: "TO_DO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "LOST", label: "Lost" },
];

export const formatContactOptions = (contacts: Contacts[]): SelectOption[] =>
  contacts.map((c) => ({
    value: String(c.id),
    label: c.companyName ? `${c.name} (${c.companyName})` : c.name || "No name",
  }));

export const formatProjectTypeOptions = (projectTypes: ProjectType[]): SelectOption[] =>
  projectTypes.map((pt) => ({ value: String(pt.id), label: pt.name }));

// -------------------------
// Wrappers HTTP (sin service)
// -------------------------

export const createLeadWithNewContact = async (
  data: CreateLeadByNewContactData
): Promise<Lead> => {
  const contact = {
    companyName: data.customerName,
    name: data.contactName,
    phone: data.phone ?? "",
    email: data.email ?? "",
  };
  const lead = {
    leadNumber: data.leadNumber ?? "",
    name: data.leadName,
    startDate: new Date().toISOString().split("T")[0],
    location: data.location ?? "",
    status: null as LeadStatus | null,
    contact,
    projectType: { id: Number(data.projectTypeId), name: "", color: "" },
    leadType: data.leadType,
  };
  const request = { lead, contact };
  const res = await optimizedApiClient.post("/leads/new-contact", request, {
    prefetch: { enabled: true, priority: "high", dependencies: ["/leads"] },
  });
  return res.data as Lead;
};

export const createLeadWithExistingContact = async (
  data: CreateLeadByExistingContactData
): Promise<Lead> => {
  const lead = {
    leadNumber: data.leadNumber ?? "",
    name: data.leadName,
    startDate: new Date().toISOString().split("T")[0],
    location: data.location ?? "",
    status: null as LeadStatus | null,
    contact: undefined,
    projectType: { id: Number(data.projectTypeId), name: "", color: "" },
    leadType: data.leadType,
  };
  const request = { lead, contactId: Number(data.contactId) };
  const res = await optimizedApiClient.post("/leads/existing-contact", request, {
    prefetch: { enabled: true, priority: "high", dependencies: ["/leads"] },
  });
  return res.data as Lead;
};

export const updateLead = async (leadId: number, data: UpdateLeadData): Promise<Lead> => {
  const updatedLead: Record<string, unknown> = {};
  if (data.name !== undefined) updatedLead.name = data.name;
  if (data.location !== undefined) updatedLead.location = data.location;
  if (data.status !== undefined) updatedLead.status = data.status;
  if (data.startDate !== undefined) updatedLead.startDate = data.startDate;
  if (data.projectTypeId !== undefined) {
    updatedLead.projectType = { id: data.projectTypeId, name: "", color: "" };
  }
  if (data.contactId !== undefined) {
    updatedLead.contact = {
      id: data.contactId,
      companyName: "",
      name: "",
      phone: "",
      email: "",
    };
  }

  const request = { lead: updatedLead };
  const dependencies: string[] = [];
  if (data.status) dependencies.push(`/leads/type?type=${data.status}`);
  if (data.projectTypeId) dependencies.push(`/leads/type?type=${data.projectTypeId}`);
  if (dependencies.length === 0) dependencies.push("/leads");

  const res = await optimizedApiClient.put(`/leads/${leadId}`, request, {
    prefetch: { enabled: true, priority: "high", dependencies },
  });
  return res.data as Lead;
};
