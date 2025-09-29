import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import type { LeadType } from "../../enums";
import { LeadStatus } from "../../enums";
import type { Lead } from "../models/Lead";
const STRICT_READ_VALIDATION = false;
const ALLOW_PLACEHOLDER_CONTACT = true;
const PLACEHOLDER_CONTACT_ID = 999999;
const PLACEHOLDER_CONTACT_NAME = "Unassigned";
export type ApiContactDTO = Readonly<{
  id?: number | null;
  companyName?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}>;

export type ApiProjectTypeDTO = Readonly<{
  id?: number | null;
  name?: string | null;
  color?: string | null;
}>;

export type ApiLeadDTO = Readonly<{
  id: number;
  leadNumber?: string | null;
  name: string;
  startDate?: string | null; 
  location?: string | null;
  status?: LeadStatus | null;
  contact?: ApiContactDTO | null;
  contactId?: number | null;
  projectType?: ApiProjectTypeDTO | null;
  projectTypeId?: number | null;
  type?: number | null;
  leadType: LeadType;
}>;
function normalizeText(s: unknown): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}
function isIsoLocalDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}
function asNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
    return Number(v);
  }
  return undefined;
}
function coerceIsoLocalDate(input: unknown): string {
  const raw = normalizeText(input);
  if (raw && isIsoLocalDate(raw)) return raw;
  if (raw && /^\d{4}-\d{2}-\d{2}T/.test(raw)) return raw.slice(0, 10);
  if (raw) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}
function resolveProjectTypeId(dto: ApiLeadDTO): number {
  const id =
    asNumber(dto.projectType?.id) ??
    asNumber(dto.projectTypeId) ??
  asNumber((dto as unknown as Record<string, unknown>)["project_type_id"]) ??
    asNumber(dto.type);
  return id && id > 0 ? id : 9999;
}
function effectiveStatus(s: LeadStatus | null | undefined): LeadStatus {
  return s ?? LeadStatus.UNDETERMINED;
}
export function mapLeadFromDTO(dto: ApiLeadDTO): Lead {
  if (!dto) {
    throw new BusinessRuleError("NOT_FOUND", "Lead payload is empty");
  }
  let contactId =
    asNumber(dto.contact?.id) ??
    asNumber(dto.contactId);

  if (!contactId || contactId <= 0) {
    if (!ALLOW_PLACEHOLDER_CONTACT) {
      throw new BusinessRuleError("INTEGRITY_VIOLATION", "contact.id is required", {
        details: { field: "contact.id", value: dto?.contact?.id ?? dto?.contactId },
      });
    }
    contactId = PLACEHOLDER_CONTACT_ID;
  }

  const projectTypeId = resolveProjectTypeId(dto);
  const startDate = coerceIsoLocalDate(dto.startDate);

  const isPlaceholderContact = contactId === PLACEHOLDER_CONTACT_ID;

  const lead: Lead = {
    id: dto.id,
    leadNumber: normalizeText(dto.leadNumber ?? ""),
    name: normalizeText(dto.name),
    startDate,
    location: normalizeText(dto.location) || undefined,
    status: effectiveStatus(dto.status),
    contact: {
      id: contactId,
      companyName: isPlaceholderContact ? "" : normalizeText(dto.contact?.companyName),
      name: isPlaceholderContact ? PLACEHOLDER_CONTACT_NAME : normalizeText(dto.contact?.name),
      phone: isPlaceholderContact ? "" : normalizeText(dto.contact?.phone),
      email: isPlaceholderContact ? "" : normalizeText(dto.contact?.email),
    },
    projectType: {
      id: projectTypeId,
      name: normalizeText(dto.projectType?.name) || "Unclassified",
      color: normalizeText(dto.projectType?.color) || "#999999",
    },
    leadType: dto.leadType,
  };
  if (STRICT_READ_VALIDATION) {
  }

  return lead;
}
export function mapLeadsFromDTO(list: readonly ApiLeadDTO[] | null | undefined): Lead[] {
  const src = Array.isArray(list) ? list : [];
  const out: Lead[] = [];
  const dropped: Array<{ id: number | undefined; reason: string }> = [];

  for (const dto of src) {
    try {
      out.push(mapLeadFromDTO(dto));
    } catch (e: unknown) {
      const reason = e instanceof Error ? e.message : "unknown error";
      dropped.push({ id: (dto as Partial<ApiLeadDTO>)?.id, reason });
    }
  }
  if (dropped.length) {
    const grouped = dropped.reduce<Record<string, number>>((acc, it) => {
      acc[it.reason] = (acc[it.reason] ?? 0) + 1;
      return acc;
    }, {});
    console.warn("[leads] read: dropped=", dropped.length, "by_reason=", grouped);
  }

  return out;
}
