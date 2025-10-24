import type { Lead, LeadStatus, LeadType } from '@/leads';
import { BusinessRuleError } from '@/shared';
import { coerceIsoLocalDate, normalizeText } from '@/shared';

const ALLOW_PLACEHOLDER_CONTACT = true;
const PLACEHOLDER_CONTACT_ID = -1 as const;
const PLACEHOLDER_CONTACT_NAME = 'Unassigned';

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

  leadName?: string | null;
  name?: string | null;

  startDate?: string | null;
  location?: string | null;
  status?: LeadStatus | null;

  contact?: ApiContactDTO;
  contactId?: number | string | null;

  projectType?: ApiProjectTypeDTO;
  projectTypeId?: number | string | null;
  type?: number | string | null;

  leadType: number | string;
}>;

function asNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)))
    return Number(v);
  return undefined;
}

function resolveProjectTypeId(dto: ApiLeadDTO): number {
  const id =
    asNumber(dto.projectType?.id) ??
    asNumber(dto.projectTypeId) ??
    asNumber((dto as unknown as Record<string, unknown>)['project_type_id']) ??
    asNumber(dto.type);
  return id && id > 0 ? id : 9999;
}

function effectiveStatus(s: LeadStatus | null | undefined): LeadStatus {
  return (s ?? 'UNDETERMINED') as LeadStatus;
}

const LEAD_TYPE_VALUES = ['CONSTRUCTION', 'PLUMBING', 'ROOFING'] as const;

function resolveLeadType(input: unknown): LeadType {
  if (typeof input === 'string') {
    const v = input.trim().toUpperCase();
    if ((LEAD_TYPE_VALUES as readonly string[]).includes(v)) {
      return v as LeadType;
    }
  }
  if (typeof input === 'number') {
    switch (input) {
      case 1:
        return 'CONSTRUCTION' as LeadType;
      case 2:
        return 'PLUMBING' as LeadType;
      case 3:
        return 'ROOFING' as LeadType;
      default:
        return 'CONSTRUCTION' as LeadType;
    }
  }
  return 'CONSTRUCTION' as LeadType;
}

export function mapLeadFromDTO(dto: ApiLeadDTO): Lead {
  if (!dto) {
    throw new BusinessRuleError('NOT_FOUND', 'Lead payload is empty');
  }

  let contactId = asNumber(dto.contact?.id) ?? asNumber(dto.contactId);

  if (!contactId || contactId <= 0) {
    if (!ALLOW_PLACEHOLDER_CONTACT) {
      throw new BusinessRuleError(
        'INTEGRITY_VIOLATION',
        'contact.id is required',
        {
          details: {
            field: 'contact.id',
            value: dto?.contact?.id ?? dto?.contactId,
          },
        },
      );
    }
    contactId = PLACEHOLDER_CONTACT_ID;
  }

  const projectTypeId = resolveProjectTypeId(dto);
  const startDate = coerceIsoLocalDate(dto.startDate);
  const isPlaceholderContact = contactId === PLACEHOLDER_CONTACT_ID;

  const rawLeadName = normalizeText((dto as any).leadName ?? dto.name ?? '');
  const rawContactName = normalizeText(dto.contact?.name ?? '');

  const lead: Lead = {
    id: dto.id,
    leadNumber: normalizeText(dto.leadNumber ?? ''),
    name: rawLeadName,
    startDate,
    location: normalizeText(dto.location) || undefined,
    status: effectiveStatus(dto.status),
    contact: {
      id: contactId,
      companyName: isPlaceholderContact
        ? ''
        : normalizeText(dto.contact?.companyName),
      name:
        rawContactName ||
        (isPlaceholderContact ? PLACEHOLDER_CONTACT_NAME : ''),
      phone: isPlaceholderContact ? '' : normalizeText(dto.contact?.phone),
      email: isPlaceholderContact ? '' : normalizeText(dto.contact?.email),
    },
    projectType: {
      id: projectTypeId,
      name: normalizeText(dto.projectType?.name) || 'Unclassified',
      color: normalizeText(dto.projectType?.color) || '#999999',
    },
    leadType: resolveLeadType(dto.leadType),
  };

  return lead;
}

export function mapLeadsFromDTO(
  list: readonly ApiLeadDTO[] | null | undefined,
): Lead[] {
  const src = Array.isArray(list) ? list : [];
  const out: Lead[] = [];
  const dropped: Array<{ id: number | undefined; reason: string }> = [];

  for (const dto of src) {
    try {
      out.push(mapLeadFromDTO(dto));
    } catch (e: unknown) {
      const reason = e instanceof Error ? e.message : 'unknown error';
      dropped.push({ id: (dto as Partial<ApiLeadDTO>)?.id, reason });
    }
  }

  if (dropped.length) {
    const grouped = dropped.reduce<Record<string, number>>((acc, it) => {
      acc[it.reason] = (acc[it.reason] ?? 0) + 1;
      return acc;
    }, {});
    const c = (globalThis as any)?.console;
    if (c && typeof c.warn === 'function') {
      c.warn('[leads] read: dropped=', dropped.length, 'by_reason=', grouped);
    }
  }

  return out;
}
