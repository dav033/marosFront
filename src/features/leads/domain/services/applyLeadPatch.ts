
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";
import { LeadStatus } from "../../enums";
import type {
  ApplyLeadPatchResult,
  Clock,
  ISODate,
  LeadPatch,
  LeadPatchPolicies,
} from "../../types";
import type { Lead } from "../models/Lead";
import { ensureLeadIntegrity } from "./ensureLeadIntegrity";
import { makeLeadNumber } from "./leadNumberPolicy";
import { applyStatus, DEFAULT_TRANSITIONS } from "./leadStatusPolicy";

/** Utilidades locales (compatibles con tu implementación actual) */
function normalizeText(s: string): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}
function isIsoLocalDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}
function validateLeadName(raw: string): string {
  const v = normalizeText(raw);
  if (!v) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Lead name must not be empty",
      { details: { field: "name" } }
    );
  }
  if (v.length > 140) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      "Lead name max length is 140",
      { details: { field: "name", length: v.length } }
    );
  }
  return v;
}
function toEffectiveStatus(s: LeadStatus | null | undefined): LeadStatus {
  return s ?? LeadStatus.UNDETERMINED;
}
function resolveTransitions(
  overrides?: Partial<Record<LeadStatus, LeadStatus[]>>
): Readonly<Record<LeadStatus, readonly LeadStatus[]>> {
  const ro = (arr?: LeadStatus[]) => (arr as readonly LeadStatus[]) || undefined;
  return {
    [LeadStatus.NEW]: ro(overrides?.[LeadStatus.NEW]) ?? DEFAULT_TRANSITIONS[LeadStatus.NEW],
    [LeadStatus.UNDETERMINED]: ro(overrides?.[LeadStatus.UNDETERMINED]) ?? DEFAULT_TRANSITIONS[LeadStatus.UNDETERMINED],
    [LeadStatus.TO_DO]: ro(overrides?.[LeadStatus.TO_DO]) ?? DEFAULT_TRANSITIONS[LeadStatus.TO_DO],
    [LeadStatus.IN_PROGRESS]: ro(overrides?.[LeadStatus.IN_PROGRESS]) ?? DEFAULT_TRANSITIONS[LeadStatus.IN_PROGRESS],
    [LeadStatus.DONE]: ro(overrides?.[LeadStatus.DONE]) ?? DEFAULT_TRANSITIONS[LeadStatus.DONE],
    [LeadStatus.LOST]: ro(overrides?.[LeadStatus.LOST]) ?? DEFAULT_TRANSITIONS[LeadStatus.LOST],
    [LeadStatus.NOT_EXECUTED]: ro(overrides?.[LeadStatus.NOT_EXECUTED]) ?? DEFAULT_TRANSITIONS[LeadStatus.NOT_EXECUTED],
  } as const;
}

/** Contexto de los manejadores */
type PatchHandlerCtx = Readonly<{
  clock: Clock;
  current: Lead;
  policies: LeadPatchPolicies;
  events: ApplyLeadPatchResult["events"];
}>;

/** Manejadores por campo: eliminan ifs repetidos y centralizan reglas */
const PATCH_HANDLERS: {
  [K in keyof LeadPatch]?: (value: LeadPatch[K], ctx: PatchHandlerCtx, acc: Lead) => Lead
} = {
  name: (v, _ctx, acc) => ({ ...acc, name: validateLeadName(String(v)) }),

  location: (v, _ctx, acc) => {
    const val = normalizeText(String(v));
    return { ...acc, location: val || undefined };
  },

  leadNumber: (v, ctx, acc) => {
    const rules = ctx.policies.leadNumberPattern
      ? { pattern: ctx.policies.leadNumberPattern }
      : undefined;
    const normalized = makeLeadNumber(v as string | null | undefined, rules);
    return { ...acc, leadNumber: normalized ?? "" };
  },

  startDate: (v, _ctx, acc) => {
    const d = normalizeText(String(v));
    if (d && !isIsoLocalDate(d)) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        "startDate must be in YYYY-MM-DD format",
        { details: { field: "startDate", value: v } }
      );
    }
    return { ...acc, startDate: d as ISODate };
  },

  projectTypeId: (id, _ctx, acc) => ({
    ...acc,
    projectType: { ...acc.projectType, id: Number(id) },
  }),

  contactId: (id, _ctx, acc) => ({
    ...acc,
    contact: { ...acc.contact, id: Number(id) },
  }),

  status: (s, ctx, acc) => {
    const to = toEffectiveStatus(s as LeadStatus | null | undefined);
    const transitions = resolveTransitions(ctx.policies.allowedTransitions);
    const { lead: withStatus, events } = applyStatus(ctx.clock, acc, to, transitions);
    if (events.length) ctx.events.push(...events);
    return withStatus;
  },
};

/**
 * Aplica un LeadPatch al Lead actual usando manejadores declarativos.
 * Conserva firma y eventos del dominio.
 */
export function applyLeadPatch(
  clock: Clock,
  current: Lead,
  patch: LeadPatch,
  policies: LeadPatchPolicies = {}
): ApplyLeadPatchResult {
  let updated: Lead = { ...current };
  const events: ApplyLeadPatchResult["events"] = [];

  const ctx: PatchHandlerCtx = { clock, current, policies, events };

    (Object.keys(patch) as (keyof LeadPatch)[])
    .filter((k) => (patch as Record<string, unknown>)[k] !== undefined)
    .forEach((k) => {
      const handler = PATCH_HANDLERS[k];
      if (handler) {
        updated = handler((patch as any)[k], ctx, updated);
      }
    });

  const integrityPolicies = policies.leadNumberPattern
    ? { leadNumberRules: { pattern: policies.leadNumberPattern } }
    : undefined;
  ensureLeadIntegrity(updated, integrityPolicies);

  return { lead: updated, events };
}
