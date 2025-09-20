// src/features/contact/domain/services/contactValidation.ts

import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";
// Si desea aislar por feature, cree contact/domain/errors/BusinessRuleError.ts y ajuste este import.

/* =========================
 *   Tipos y configuración
 * ========================= */

export type ContactValidationPolicies = Readonly<{
  maxNameLength?: number;        // default 140
  maxCompanyLength?: number;     // default 140
  minPhoneDigits?: number;       // default 7
  requireAtLeastOneReach?: boolean; // exigir email o phone (default false)
  validateLastContactISO?: boolean; // validar ISO-8601 si viene (default false)
}>;

export const DEFAULT_POLICIES: Required<ContactValidationPolicies> = {
  maxNameLength: 140,
  maxCompanyLength: 140,
  minPhoneDigits: 7,
  requireAtLeastOneReach: false,
  validateLastContactISO: false,
};

export type ContactField =
  | "companyName"
  | "name"
  | "email"
  | "phone"
  | "occupation"
  | "product"
  | "address"
  | "lastContact";

export type ValidationCode =
  | "REQUIRED"
  | "TOO_LONG"
  | "FORMAT"
  | "MIN_DIGITS"
  | "NOT_ISO"
  | "AT_LEAST_ONE"; // email o phone requerido(s)

export type ValidationIssue = Readonly<{
  field: ContactField | "global";
  code: ValidationCode;
  message: string;
  details?: Record<string, unknown>;
}>;

/* =========================
 *   Utilidades puras
 * ========================= */

export function normText(s: unknown): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

export function normLower(s: unknown): string {
  return normText(s).toLowerCase();
}

/** Regex pragmático para email (suficiente para UI). */
export function isValidEmail(email?: string): boolean {
  if (!email) return true; // vacío permitido salvo política superior
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Cuenta dígitos de un teléfono ya normalizado (o crudo). */
export function countPhoneDigits(p?: string): number {
  if (!p) return 0;
  return String(p).replace(/\D+/g, "").length;
}

/** YYYY-MM-DD o ISO 8601 con hora. */
export function isISODateOrDateTime(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+\-]\d{2}:\d{2})?)?$/.test(
    s
  );
}

/* =========================
 *   API de validación
 * ========================= */

/**
 * Valida campos de contacto (draft o patch ya normalizado).
 * Devuelve la lista de issues sin lanzar.
 */
export function collectContactValidationIssues(
  input: Partial<Record<ContactField, unknown>>,
  policies: ContactValidationPolicies = {}
): ValidationIssue[] {
  const cfg = { ...DEFAULT_POLICIES, ...policies };
  const issues: ValidationIssue[] = [];

  const companyName = normText(input.companyName as string);
  const name = normText(input.name as string);
  const email = normText(input.email as string);
  const phone = normText(input.phone as string);
  const lastContact = normText(input.lastContact as string);

  // Requeridos
  if ("companyName" in input && !companyName) {
    issues.push({
      field: "companyName",
      code: "REQUIRED",
      message: "Company name must not be empty",
    });
  }
  if ("name" in input && !name) {
    issues.push({
      field: "name",
      code: "REQUIRED",
      message: "Contact name must not be empty",
    });
  }

  // Longitudes
  if (companyName && companyName.length > cfg.maxCompanyLength) {
    issues.push({
      field: "companyName",
      code: "TOO_LONG",
      message: `Company name max length is ${cfg.maxCompanyLength}`,
      details: { length: companyName.length },
    });
  }
  if (name && name.length > cfg.maxNameLength) {
    issues.push({
      field: "name",
      code: "TOO_LONG",
      message: `Contact name max length is ${cfg.maxNameLength}`,
      details: { length: name.length },
    });
  }

  // Políticas de contacto
  if (cfg.requireAtLeastOneReach) {
    const hasEmail = !!email;
    const hasPhone = !!phone;
    if (!hasEmail && !hasPhone) {
      issues.push({
        field: "global",
        code: "AT_LEAST_ONE",
        message: "Provide at least one contact method (email or phone)",
        details: { fields: ["email", "phone"] },
      });
    }
  }

  // Email si existe
  if (email && !isValidEmail(email)) {
    issues.push({
      field: "email",
      code: "FORMAT",
      message: "Invalid email format",
      details: { value: email },
    });
  }

  // Teléfono si existe
  if (phone && countPhoneDigits(phone) < cfg.minPhoneDigits) {
    issues.push({
      field: "phone",
      code: "MIN_DIGITS",
      message: `Phone must contain at least ${cfg.minPhoneDigits} digits`,
      details: { value: phone },
    });
  }

  // lastContact ISO (opcional)
  if (cfg.validateLastContactISO && lastContact && !isISODateOrDateTime(lastContact)) {
    issues.push({
      field: "lastContact",
      code: "NOT_ISO",
      message: "lastContact must be ISO-8601 date/datetime",
      details: { value: lastContact },
    });
  }

  return issues;
}

/**
 * Lanza BusinessRuleError si existe al menos un issue.
 * Útil para endpoints de caso de uso que prefieren fail-fast.
 */
export function assertNoValidationIssues(
  issues: readonly ValidationIssue[]
): void {
  if (!issues || issues.length === 0) return;
  throw new BusinessRuleError("VALIDATION_ERROR", "Contact validation failed", {
    details: { issues },
  });
}

/**
 * Atajo: valida y lanza si hay errores.
 * Útil desde servicios como ensureContactDraftIntegrity/applyContactPatch.
 */
export function validateOrThrow(
  input: Partial<Record<ContactField, unknown>>,
  policies: ContactValidationPolicies = {}
): void {
  const issues = collectContactValidationIssues(input, policies);
  assertNoValidationIssues(issues);
}
