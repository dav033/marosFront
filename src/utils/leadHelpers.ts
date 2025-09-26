import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { ProjectType } from "@/features/leads/domain/models/ProjectType";
import type { LeadStatus, LeadType } from "@/features/leads/enums";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

import type {
  CreateLeadByExistingContactData,
  CreateLeadByNewContactData,
  UpdateLeadData,
} from "@/types";
import type {
  LeadForEdit,
  SelectOption,
  StatusOption,
  ValidateEditLeadData,
  ValidateExistingContactLeadData,
  ValidateNewContactLeadData,
} from "@/types/utils/validation";

import { createLead } from "@/features/leads/application";
import type { LeadsAppContext } from "@/features/leads/application";

export const validateEmail = (email: string): boolean => {
  if (!email) return true;
  return /\S+@\S+\.\S+/.test(email);
};

export const validateNewContactLead = (
  data: ValidateNewContactLeadData
): string | null => {
  if (data.leadNumber && data.leadNumber.trim().length < 3)
    return "Lead Number is too short";
  if (!data.leadName || !data.projectTypeId)
    return "Please complete the required fields: Lead Name and Project Type";
  if (!data.customerName || !data.contactName)
    return "Please complete Customer Name and Contact Name to create a new contact";
  if (data.email && !validateEmail(data.email))
    return "Please enter a valid email";
  return null;
};

export const validateExistingContactLead = (
  data: ValidateExistingContactLeadData
): string | null => {
  if (data.leadNumber && data.leadNumber.trim().length < 3)
    return "Lead Number is too short";
  if (!data.leadName || !data.projectTypeId)
    return "Please complete the required fields: Lead Name and Project Type";
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

export const formatContactOptions = (contacts: Contact[]): SelectOption[] =>
  contacts.map((c) => ({
    value: String(c.id),
    label: c.companyName ? `${c.name} (${c.companyName})` : c.name || "No name",
  }));

export const formatProjectTypeOptions = (
  projectTypes: ProjectType[]
): SelectOption[] =>
  projectTypes.map((pt) => ({ value: String(pt.id), label: pt.name }));

export const createLeadWithNewContact = async (
  ctx: LeadsAppContext,
  data: CreateLeadByNewContactData,
  opts?: { policies?: {}; checkNumberAvailability?: boolean }
): Promise<Lead> => {
  return createLead(
    ctx,
    {
      leadName: data.leadName,
      leadNumber: data.leadNumber ?? null,
      location: data.location ?? "",
      projectTypeId: Number(data.projectTypeId),
      leadType: data.leadType as LeadType,
      contact: {
        companyName: data.customerName || "",
        name: data.contactName || "",
        phone: data.phone || "",
        email: data.email || "",
      },
    },
    {
      checkNumberAvailability: opts?.checkNumberAvailability ?? true,
      policies: opts?.policies ?? {},
    }
  ) as unknown as Lead;
};

export const createLeadWithExistingContact = async (
  ctx: LeadsAppContext,
  data: CreateLeadByExistingContactData,
  opts?: { policies?: {}; checkNumberAvailability?: boolean }
): Promise<Lead> => {
  return createLead(
    ctx,
    {
      leadName: data.leadName,
      leadNumber: data.leadNumber ?? null,
      location: data.location ?? "",
      projectTypeId: Number(data.projectTypeId),
      leadType: data.leadType as LeadType,
      contactId: Number(data.contactId),
    },
    {
      checkNumberAvailability: opts?.checkNumberAvailability ?? true,
      policies: opts?.policies ?? {},
    }
  ) as unknown as Lead;
};

export const updateLead = async (
  leadId: number,
  data: UpdateLeadData
): Promise<Lead> => {
  const updatedLead: Record<string, unknown> = {};
  if (data.name !== undefined) updatedLead["name"] = data.name;
  if (data.location !== undefined) updatedLead["location"] = data.location;
  if (data.status !== undefined) updatedLead["status"] = data.status;
  if (data.startDate !== undefined) updatedLead["startDate"] = data.startDate;
  if (data.projectTypeId !== undefined) {
    updatedLead["projectType"] = {
      id: data.projectTypeId,
      name: "",
      color: "",
    };
  }
  if (data.contactId !== undefined) {
    updatedLead["contact"] = {
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
  if (data.projectTypeId)
    dependencies.push(`/leads/type?type=${data.projectTypeId}`);
  if (dependencies.length === 0) dependencies.push("/leads");

  const res = await optimizedApiClient.put(`/leads/${leadId}`, request, {
    prefetch: { dependencies },
  });
  return res.data as Lead;
};
