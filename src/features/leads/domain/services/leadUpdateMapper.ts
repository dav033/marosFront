import type { ISODate, LeadPatch, LeadStatus } from '@/leads';

export type UpdateLeadDTO = Readonly<{
  name?: string;
  location?: string;
  status?: LeadStatus | null;
  startDate?: ISODate;
  projectType?: Readonly<{ id: number }>;
  contact?: Readonly<{ id: number }>;
  leadNumber?: string;
}>;

export type UpdateLeadPayload = Readonly<{
  lead: Partial<UpdateLeadDTO>;
}>;

function toProjectTypeDTO(id: number): Readonly<{ id: number }> {
  return { id } as const;
}

export type MapLeadPatchOptions = Readonly<{
  includeLeadNumber?: boolean;
}>;

export function mapLeadPatchToUpdatePayload(
  patch: LeadPatch,
  { includeLeadNumber = false }: MapLeadPatchOptions = {},
): UpdateLeadPayload {
  const name = patch.name !== undefined ? String(patch.name).trim() : undefined;

  const location =
    patch.location !== undefined ? String(patch.location).trim() : undefined;

  const wantLeadNumber =
    includeLeadNumber &&
    patch.leadNumber !== undefined &&
    patch.leadNumber !== null;

  const leadNumber = wantLeadNumber ? String(patch.leadNumber).trim() : '';

  const lead: Partial<UpdateLeadDTO> = {
    ...(name ? { name } : {}),
    ...(location ? { location } : {}),

    ...(patch.status !== undefined ? { status: patch.status ?? null } : {}),

    ...(patch.startDate !== undefined
      ? { startDate: patch.startDate as ISODate }
      : {}),

    ...(patch.projectTypeId !== undefined && patch.projectTypeId !== null
      ? { projectType: toProjectTypeDTO(patch.projectTypeId) }
      : {}),

    ...(patch.contactId !== undefined && patch.contactId !== null
      ? { contact: { id: patch.contactId } as const }
      : {}),

    ...(wantLeadNumber && leadNumber !== '' ? { leadNumber } : {}),
  };

  return { lead };
}
