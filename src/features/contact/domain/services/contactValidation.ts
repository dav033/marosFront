
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";


export type ContactValidationPolicies = Readonly<{
  maxNameLength?: number;        
  maxCompanyLength?: number;     
  minPhoneDigits?: number;       
  requireAtLeastOneReach?: boolean; 
  validateLastContactISO?: boolean; 
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
  | "AT_LEAST_ONE"; 

export type ValidationIssue = Readonly<{
  field: ContactField | "global";
  code: ValidationCode;
  message: string;
  details?: Record<string, unknown>;
}>;


export function normText(s: unknown): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

export function normLower(s: unknown): string {
  return normText(s).toLowerCase();
}

export function isValidEmail(email?: string): boolean {
  if (!email) return true; 
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function countPhoneDigits(p?: string): number {
  if (!p) return 0;
  return String(p).replace(/\D+/g, "").length;
}

export function isISODateOrDateTime(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+\-]\d{2}:\d{2})?)?$/.test(
    s
  );
}


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
  if (email && !isValidEmail(email)) {
    issues.push({
      field: "email",
      code: "FORMAT",
      message: "Invalid email format",
      details: { value: email },
    });
  }
  if (phone && countPhoneDigits(phone) < cfg.minPhoneDigits) {
    issues.push({
      field: "phone",
      code: "MIN_DIGITS",
      message: `Phone must contain at least ${cfg.minPhoneDigits} digits`,
      details: { value: phone },
    });
  }
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

export function assertNoValidationIssues(
  issues: readonly ValidationIssue[]
): void {
  if (!issues || issues.length === 0) return;
  throw new BusinessRuleError("VALIDATION_ERROR", "Contact validation failed", {
    details: { issues },
  });
}

export function validateOrThrow(
  input: Partial<Record<ContactField, unknown>>,
  policies: ContactValidationPolicies = {}
): void {
  const issues = collectContactValidationIssues(input, policies);
  assertNoValidationIssues(issues);
}
