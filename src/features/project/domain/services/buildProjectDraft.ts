// src/features/project/domain/services/buildProjectDraft.ts

import { BusinessRuleError } from "../errors/BusinessRuleError";
import type { ProjectStatus, InvoiceStatus } from "../../enums";
import type {
  LeadId,
  Clock,
  ProjectPolicies,
  ProjectDraft,
  ISODate,
} from "../../types";

/** Entradas para construir un ProjectDraft. */
export type ProjectDraftInput = Readonly<{
  projectName: string;
  overview?: string;
  payments?: number[];
  projectStatus?: ProjectStatus;
  invoiceStatus?: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  leadId?: LeadId;
}>;

/* ----------------- Utils puras ----------------- */
function normText(s: unknown): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseISODate(dateStr?: string | null): ISODate | undefined {
  if (!dateStr) return undefined;
  const normalized = dateStr.trim();
  if (!normalized) return undefined;
  
  // Validación básica de formato YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(normalized)) {
    throw new BusinessRuleError("FORMAT_ERROR", `Invalid date format: ${normalized}. Expected YYYY-MM-DD`);
  }
  
  return normalized as ISODate;
}

function normalizePayments(payments?: number[]): number[] | undefined {
  if (!payments || !Array.isArray(payments)) return undefined;
  
  const normalized = payments
    .filter(p => typeof p === 'number' && !isNaN(p))
    .map(p => Math.max(0, p)); // No permitir pagos negativos
  
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Construye un ProjectDraft validado desde entradas del usuario.
 */
export function buildProjectDraft(
  input: ProjectDraftInput,
  policies: ProjectPolicies = {},
  clock: Clock
): ProjectDraft {
  const projectName = normText(input.projectName);
  
  // Validaciones obligatorias
  if (!projectName) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Project name is required");
  }
  
  if (policies.requireLead && !input.leadId) {
    throw new BusinessRuleError("POLICY_VIOLATION", "Lead is required by policy");
  }
  
  const overview = input.overview ? normText(input.overview) : undefined;
  const payments = normalizePayments(input.payments);
  
  if (!policies.allowEmptyPayments && payments && payments.length === 0) {
    throw new BusinessRuleError("POLICY_VIOLATION", "Empty payments array not allowed by policy");
  }
  
  const startDate = parseISODate(input.startDate);
  const endDate = parseISODate(input.endDate);
  
  // Validar que endDate sea posterior a startDate si ambas están presentes
  if (startDate && endDate && endDate <= startDate) {
    throw new BusinessRuleError("VALIDATION_ERROR", "End date must be after start date");
  }
  
  return {
    projectName,
    overview,
    payments,
    projectStatus: input.projectStatus,
    invoiceStatus: input.invoiceStatus,
    quickbooks: input.quickbooks,
    startDate,
    endDate,
    leadId: input.leadId,
  };
}