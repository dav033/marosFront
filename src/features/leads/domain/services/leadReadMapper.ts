/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { Lead } from "@/leads";
import { BusinessRuleError } from "@/shared";

// eslint-disable-next-line no-restricted-imports
import { LeadStatus, LeadType } from "../../enums";

/** Flags y constantes de lectura */
const STRICT_READ_VALIDATION = false;
const ALLOW_PLACEHOLDER_CONTACT = true;
const PLACEHOLDER_CONTACT_ID = -1 as const;
const PLACEHOLDER_CONTACT_NAME = "Unassigned";

/** DTO mínimo esperado desde API (flexible a llaves históricas) */
export type ApiProjectTypeDTO = {
  id?: number | string | null;
  name?: string | null;
  color?: string | null;
} | null;

export type ApiContactDTO = {
  id?: number | string | null;
  companyName?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
} | null;

export type ApiLeadDTO = Readonly<{
  id: number;
  leadNumber?: string | null;

  /** Algunos backends devuelven 'leadName' (preferir) y otros 'name' */
  leadName?: string | null;
  name?: string | null;

  startDate?: string | null;
  location?: string | null;
  status?: LeadStatus | null;

  contact?: ApiContactDTO;
  contactId?: number | string | null;

  projectType?: ApiProjectTypeDTO;
  projectTypeId?: number | string | null;
  /** compatibilidad */
  type?: number | string | null;

  leadType: number | string; // enum en el dominio
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

function resolveLeadType(input: unknown): LeadType {
  if (typeof input === "string") {
    const v = input.trim().toUpperCase();
    if ((Object.values(LeadType) as string[]).includes(v)) {
      return v as LeadType;
    }
  }
  if (typeof input === "number") {
    switch (input) {
      case 1: return LeadType.CONSTRUCTION;
      case 2: return LeadType.PLUMBING;
      case 3: return LeadType.ROOFING;
      default: return LeadType.CONSTRUCTION;
    }
  }
  return LeadType.CONSTRUCTION;
}

/**
 * REGLAS:
 * - 'lead.name' = dto.leadName ?? dto.name  ← (SIEMPRE el nombre del LEAD)
 * - Si llega 'contact.name', NO lo pisamos por "Unassigned" aunque el id sea placeholder.
 */
export function mapLeadFromDTO(dto: ApiLeadDTO): Lead {
  if (!dto) {
    throw new BusinessRuleError("NOT_FOUND", "Lead payload is empty");
  }

  let contactId = asNumber(dto.contact?.id) ?? asNumber(dto.contactId);

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

  // ⬇️ AQUÍ EL CAMBIO: SIEMPRE el nombre del LEAD
  const rawLeadName = normalizeText((dto as any).leadName ?? dto.name ?? "");

  // Si el backend trae nombre real del contacto, úsalo; si no, placeholder solo si aplica
  const rawContactName = normalizeText(dto.contact?.name ?? "");

  const lead: Lead = {
    id: dto.id,
    leadNumber: normalizeText(dto.leadNumber ?? ""),
    name: rawLeadName,                    // ← “Name” en la tabla saldrá de aquí
    startDate,
    location: normalizeText(dto.location) || undefined,
    status: effectiveStatus(dto.status),
    contact: {
      id: contactId,
      companyName: isPlaceholderContact ? "" : normalizeText(dto.contact?.companyName),
      name: rawContactName || (isPlaceholderContact ? PLACEHOLDER_CONTACT_NAME : ""),
      phone: isPlaceholderContact ? "" : normalizeText(dto.contact?.phone),
      email: isPlaceholderContact ? "" : normalizeText(dto.contact?.email),
    },
    projectType: {
      id: projectTypeId,
      name: normalizeText(dto.projectType?.name) || "Unclassified",
      color: normalizeText(dto.projectType?.color) || "#999999",
    },
    leadType: resolveLeadType(dto.leadType),
  };

  if (STRICT_READ_VALIDATION) {
    // ganchos de validación extra si se requieren
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
    const c = (globalThis as any)?.console;
    if (c && typeof c.warn === "function") {
      c.warn("[leads] read: dropped=", dropped.length, "by_reason=", grouped);
    }
  }

  return out;
}
