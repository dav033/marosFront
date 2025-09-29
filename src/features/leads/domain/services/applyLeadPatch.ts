
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
  const ro = (arr?: LeadStatus[]) =>
    arr ? (arr as readonly LeadStatus[]) : undefined;
  return {
    [LeadStatus.NEW]:
      ro(overrides?.[LeadStatus.NEW]) ??
      DEFAULT_TRANSITIONS[LeadStatus.NEW],
    [LeadStatus.UNDETERMINED]:
      ro(overrides?.[LeadStatus.UNDETERMINED]) ??
      DEFAULT_TRANSITIONS[LeadStatus.UNDETERMINED],
    [LeadStatus.TO_DO]:
      ro(overrides?.[LeadStatus.TO_DO]) ??
      DEFAULT_TRANSITIONS[LeadStatus.TO_DO],
    [LeadStatus.IN_PROGRESS]:
      ro(overrides?.[LeadStatus.IN_PROGRESS]) ??
      DEFAULT_TRANSITIONS[LeadStatus.IN_PROGRESS],
    [LeadStatus.DONE]:
      ro(overrides?.[LeadStatus.DONE]) ??
      DEFAULT_TRANSITIONS[LeadStatus.DONE],
    [LeadStatus.LOST]:
      ro(overrides?.[LeadStatus.LOST]) ??
      DEFAULT_TRANSITIONS[LeadStatus.LOST],
    [LeadStatus.NOT_EXECUTED]:
      ro(overrides?.[LeadStatus.NOT_EXECUTED]) ??
      DEFAULT_TRANSITIONS[LeadStatus.NOT_EXECUTED],
  } as const;
}


export function applyLeadPatch(
  clock: Clock,
  current: Lead,
  patch: LeadPatch,
  policies: LeadPatchPolicies = {}
): ApplyLeadPatchResult {
  let updated: Lead = { ...current };
  const events: ApplyLeadPatchResult["events"] = [];
  if (patch.name !== undefined) {
    updated = { ...updated, name: validateLeadName(patch.name) };
  }
  if (patch.location !== undefined) {
    const v = normalizeText(patch.location);
    updated = { ...updated, location: v || undefined };
  }
  if (patch.leadNumber !== undefined) {
    const rules = policies.leadNumberPattern
      ? { pattern: policies.leadNumberPattern }
      : undefined;
    const normalized = makeLeadNumber(patch.leadNumber, rules);
    updated = { ...updated, leadNumber: normalized ?? "" };
  }
  if (patch.startDate !== undefined) {
    const d = normalizeText(patch.startDate);
    if (d && !isIsoLocalDate(d)) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        "startDate must be in YYYY-MM-DD format",
        { details: { field: "startDate", value: patch.startDate } }
      );
    }
    updated = { ...updated, startDate: d as ISODate };
  }
  if (patch.projectTypeId !== undefined) {
    updated = {
      ...updated,
      projectType: {
        ...updated.projectType,
        id: patch.projectTypeId,
      },
    };
  }
  if (patch.contactId !== undefined) {
    updated = {
      ...updated,
      contact: {
        ...updated.contact,
        id: patch.contactId,
      },
    };
  }
  if (patch.status !== undefined) {
    const to = toEffectiveStatus(patch.status);

    const transitions = resolveTransitions(policies.allowedTransitions);
    const { lead: withStatus, events: statusEvents } = applyStatus(
      clock,
      updated,
      to,
      transitions
    );

    updated = withStatus;
    events.push(...statusEvents);
  }
  const integrityPolicies = policies.leadNumberPattern
    ? { leadNumberRules: { pattern: policies.leadNumberPattern } }
    : undefined;
  ensureLeadIntegrity(updated, integrityPolicies);

  return { lead: updated, events };
}
