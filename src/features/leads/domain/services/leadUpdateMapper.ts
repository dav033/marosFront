// maros-app/src/features/leads/domain/services/leadUpdateMapper.ts

import type { LeadStatus } from "../../enums";
import type { ISODate, LeadPatch } from "../../types";

/** DTO mínimo esperado por el backend para actualización (PUT /leads/{id}) */
export type UpdateLeadDTO = Readonly<{
  // Todos opcionales porque es un patch
  name?: string;
  location?: string;
  status?: LeadStatus | null; // el backend acepta null
  startDate?: ISODate;
  projectType?: Readonly<{ id: number; name: string; color: string }>;
  contact?: Readonly<{
    id: number;
    companyName?: string;
    name?: string;
    phone?: string;
    email?: string;
  }>;
  /**
   * Si su backend soporta actualizar el leadNumber vía PUT,
   * habilítelo con la opción 'includeLeadNumber'.
   */
  leadNumber?: string;
}>;

export type UpdateLeadPayload = Readonly<{
  lead: Partial<UpdateLeadDTO>;
}>;

/** Construye el objeto projectType del backend (name/color vacíos por compatibilidad). */
function toProjectTypeDTO(id: number) {
  return { id, name: "", color: "" } as const;
}

export type MapLeadPatchOptions = Readonly<{
  /**
   * Por defecto 'false' para respetar el servicio actual que NO envía leadNumber en update.
   * Póngalo en 'true' si el endpoint soporta actualizar el número.
   */
  includeLeadNumber?: boolean;
}>;

/**
 * Mapea un LeadPatch de dominio al payload de actualización para la API.
 * - No normaliza valores (eso ya lo hace 'applyLeadPatch' en dominio).
 * - Mapea projectTypeId/contactId a las estructuras esperadas por el backend.
 * - Se construye en un único literal para evitar asignar sobre propiedades readonly.
 */
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
      ? { leadNumber: patch.leadNumber ?? "" }
      : {}),
  };

  return { lead };
}
