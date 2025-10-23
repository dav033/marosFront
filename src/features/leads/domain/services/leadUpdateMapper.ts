import type { ISODate, LeadPatch,LeadStatus } from "@/leads";

export type UpdateLeadDTO = Readonly<{
  name?: string;
  location?: string;
  status?: LeadStatus | null; 
  startDate?: ISODate;
  projectType?: Readonly<{ id: number; name: string; color: string }>;
  contact?: Readonly<{
    id: number;
    companyName?: string;
    name?: string;
    phone?: string;
    email?: string;
  }>;
    leadNumber?: string;
}>;

export type UpdateLeadPayload = Readonly<{
  lead: Partial<UpdateLeadDTO>;
}>;

function toProjectTypeDTO(id: number) {
  return { id, name: "", color: "" } as const;
}

export type MapLeadPatchOptions = Readonly<{
    includeLeadNumber?: boolean;
}>;

export function mapLeadPatchToUpdatePayload(
  patch: LeadPatch,
  { includeLeadNumber = false }: MapLeadPatchOptions = {}
): UpdateLeadPayload {
  const projectType =
    patch.projectTypeId !== undefined ? toProjectTypeDTO(patch.projectTypeId) : undefined;

  const contact =
    patch.contactId !== undefined ? ({ id: patch.contactId } as const) : undefined;

  const lead: Partial<UpdateLeadDTO> = {
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.location !== undefined ? { location: patch.location } : {}),
    ...(patch.status !== undefined ? { status: patch.status ?? null } : {}),
    ...(patch.startDate !== undefined ? { startDate: patch.startDate as ISODate } : {}),
    ...(projectType ? { projectType } : {}),
    ...(contact ? { contact } : {}),
    ...(includeLeadNumber && patch.leadNumber !== undefined
      ? { leadNumber: String(patch.leadNumber ?? "") }
      : {}),
  };

  return { lead };
}
