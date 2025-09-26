
import type { LeadStatus,LeadType } from "../../enums";
import type {
  ISODate,
  LeadDraft,
  LeadDraftWithExistingContact,
  LeadDraftWithNewContact,
} from "../../types";

/* ----------------- Tipos DTO (payload hacia backend) ----------------- */

export type CreateContactDTO = Readonly<{
  companyName: string;
  name: string;
  phone: string;
  email: string;
}>;

export type CreateLeadDTO = Readonly<{
  leadNumber: string;           // backend espera string ("" si vacío)
  name: string;
  startDate: ISODate;
  location: string;
  status: LeadStatus | null;    // compatible con backend actual
  contact?: CreateContactDTO;   // sólo en flujo "new contact"
  projectType: Readonly<{ id: number; name: string; color: string }>;
  leadType: LeadType;
}>;

export type CreateLeadWithNewContactPayload = Readonly<{
  lead: CreateLeadDTO;
  contact: CreateContactDTO;
}>;

export type CreateLeadWithExistingContactPayload = Readonly<{
  lead: Omit<CreateLeadDTO, "contact"> & { contact?: undefined };
  contactId: number;
}>;

export type CreateLeadPayload =
  | CreateLeadWithNewContactPayload
  | CreateLeadWithExistingContactPayload;

/* ----------------- Mapper principal ----------------- */

function toProjectTypeDTO(id: number) {
  return { id, name: "", color: "" } as const;
}

export function mapDraftWithNewContactToPayload(
  draft: LeadDraftWithNewContact
): CreateLeadWithNewContactPayload {
  const contact: CreateContactDTO = {
    companyName: draft.contact.companyName,
    name: draft.contact.name,
    phone: draft.contact.phone,
    email: draft.contact.email,
  };

  const lead: CreateLeadDTO = {
    leadNumber: draft.leadNumber ?? "", // compat: "" cuando el usuario borra el número
    name: draft.name,
    startDate: draft.startDate,
    location: draft.location,
    status: draft.status ?? null,
    contact, // también anidado (como hace el servicio actual)
    projectType: toProjectTypeDTO(draft.projectTypeId),
    leadType: draft.leadType,
  };

  return { lead, contact };
}

export function mapDraftWithExistingContactToPayload(
  draft: LeadDraftWithExistingContact
): CreateLeadWithExistingContactPayload {
  const lead: Omit<CreateLeadDTO, "contact"> & { contact?: undefined } = {
    leadNumber: draft.leadNumber ?? "",
    name: draft.name,
    startDate: draft.startDate,
    location: draft.location,
    status: draft.status ?? null,
    projectType: toProjectTypeDTO(draft.projectTypeId),
    leadType: draft.leadType,
    contact: undefined,
  };

  return { lead, contactId: draft.contactId };
}

export function mapLeadDraftToCreatePayload(draft: LeadDraft): CreateLeadPayload {
  if ("contact" in draft) {
    return mapDraftWithNewContactToPayload(draft);
  }
  return mapDraftWithExistingContactToPayload(draft as LeadDraftWithExistingContact);
}
