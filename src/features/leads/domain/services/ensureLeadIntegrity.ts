import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";
import type { LeadStatus as LeadStatusType } from "../../enums";
import { LeadStatus } from "../../enums";
import type { LeadNumberRules } from "../../types";
import type { Lead } from "../models/Lead";
import {
  normalizeLeadNumber,
  validateLeadNumberFormat,
} from "./leadNumberPolicy";

function normalizeText(s: unknown): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function isIsoLocalDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export type LeadIntegrityPolicies = Readonly<{
  leadNumberRules?: LeadNumberRules;
}>;

export function ensureLeadIntegrity(
  lead: Lead,
  policies: LeadIntegrityPolicies = {}
): void {
  if (
    typeof lead.id !== "number" ||
    !Number.isFinite(lead.id) ||
    lead.id <= 0
  ) {
    throw new BusinessRuleError(
      "INTEGRITY_VIOLATION",
      "Lead.id must be a positive number",
      {
        details: { field: "id", value: lead.id },
      }
    );
  }
  const name = normalizeText(lead.name);
  if (!name) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Lead name must not be empty",
      {
        details: { field: "name" },
      }
    );
  }
  if (name.length > 140) {
    throw new BusinessRuleError("FORMAT_ERROR", "Lead name max length is 140", {
      details: { field: "name", length: name.length },
    });
  }
  const sd = normalizeText(lead.startDate);
  if (!sd || !isIsoLocalDate(sd)) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      "startDate must be in YYYY-MM-DD format",
      {
        details: { field: "startDate", value: lead.startDate },
      }
    );
  }
  if (
    !lead.projectType ||
    typeof lead.projectType.id !== "number" ||
    !Number.isFinite(lead.projectType.id) ||
    lead.projectType.id <= 0
  ) {
    throw new BusinessRuleError(
      "INTEGRITY_VIOLATION",
      "projectType.id must be a positive number",
      {
        details: { field: "projectType.id", value: lead.projectType?.id },
      }
    );
  }
  if (
    !lead.contact ||
    typeof lead.contact.id !== "number" ||
    !Number.isFinite(lead.contact.id) ||
    lead.contact.id <= 0
  ) {
    throw new BusinessRuleError(
      "INTEGRITY_VIOLATION",
      "contact.id must be a positive number",
      {
        details: { field: "contact.id", value: lead.contact?.id },
      }
    );
  }
  const s = lead.status as LeadStatusType | null | undefined;
  const effectiveStatus = (s ?? LeadStatus.UNDETERMINED) as LeadStatusType;
  if (!(effectiveStatus in LeadStatus)) {
    throw new BusinessRuleError("FORMAT_ERROR", "Invalid lead status", {
      details: { field: "status", value: lead.status },
    });
  }
  if (typeof lead.leadNumber === "string") {
    const normalized = normalizeLeadNumber(
      lead.leadNumber,
      policies.leadNumberRules
    );
    if (policies.leadNumberRules) {
      validateLeadNumberFormat(normalized, policies.leadNumberRules);
    }
  }
}

export function isLeadIntegrityOK(
  lead: Lead,
  policies: LeadIntegrityPolicies = {}
): boolean {
  try {
    ensureLeadIntegrity(lead, policies);
    return true;
  } catch {
    return false;
  }
}
