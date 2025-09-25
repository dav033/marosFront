// src/features/leads/application/usecases/commands/createLead.ts

import type { LeadsAppContext } from "../../context";

import type {
  Lead,
  LeadPolicies,
  LeadType,
  ProjectTypeId,
  ContactId,
} from "@/features/leads/domain";
import {
  buildLeadDraftForExistingContact,
  buildLeadDraftForNewContact,
} from "@/features/leads/domain";
import { ensureLeadNumberAvailable } from "@/features/leads/domain/services/leadNumberPolicy";
import type { NewContact } from "@/features/leads/types";

/** Unión discriminada: o viene contactId, o viene un objeto contact */
export type CreateLeadInput =
  | Readonly<{
      leadName: string;
      leadNumber?: string | null;
      location: string;
      projectTypeId: ProjectTypeId;
      leadType: LeadType;
      contactId: ContactId;
    }>
  | Readonly<{
      leadName: string;
      leadNumber?: string | null;
      location: string;
      projectTypeId: ProjectTypeId;
      leadType: LeadType;
      contact: NewContact;
    }>;

export type CreateLeadOptions = Readonly<{
  policies?: LeadPolicies;
  /** Si true, valida disponibilidad del número antes de crear (default: true) */
  checkNumberAvailability?: boolean;
}>;

/**
 * Caso de uso unificado para crear Lead (con contacto existente o nuevo).
 * - Reutiliza los builders de dominio para ambas ramas.
 * - Aplica la política opcional de unicidad de leadNumber.
 */
export async function createLead(
  ctx: LeadsAppContext,
  input: CreateLeadInput,
  options: CreateLeadOptions = {}
): Promise<Lead> {
  const { policies = {}, checkNumberAvailability = true } = options;

  // 1) Construcción del draft discriminando por clave
  const draft =
    "contactId" in input
      ? buildLeadDraftForExistingContact(ctx.clock, input, policies)
      : buildLeadDraftForNewContact(ctx.clock, input, policies);

  // 2) Validar disponibilidad de número si corresponde
  if (checkNumberAvailability && draft.leadNumber) {
    await ensureLeadNumberAvailable(draft.leadNumber, async (n) => {
      // La policy espera "exists" → boolean; el servicio expone "isAvailable"
      const available =
        await ctx.services.leadNumberAvailability.isAvailable(n);
      return !available; // exists? = !isAvailable
    });
  }

  // 3) Persistir
  return ctx.repos.lead.saveNew(draft);
}

/* ============================================================
   Aliases de tipos SOLO para compatibilidad de compilación.
   (Útiles si algún archivo referenciaba los tipos antiguos.)
   Puede eliminarlos más adelante si lo desea.
   ============================================================ */

export type CreateLeadWithExistingContactInput = Extract<
  CreateLeadInput,
  { contactId: ContactId }
>;

export type CreateLeadWithNewContactInput = Extract<
  CreateLeadInput,
  { contact: NewContact }
>;
