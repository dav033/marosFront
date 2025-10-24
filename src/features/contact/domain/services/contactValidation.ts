import { BusinessRuleError, countDigits, isISODateOrDateTime, isValidEmail, normalizeText } from "@/shared";


export type ContactField =
  | "companyName"
  | "name"
  | "email"
  | "phone"
  | "occupation"
  | "product"
  | "address"
  | "lastContact";

export type ValidationIssue = Readonly<{
  field: ContactField | "global";
  code: string;
  message: string;
  details?: Record<string, unknown>;
}>;

export type ContactValidationPolicies = Readonly<{
  maxNameLength?: number;
  maxCompanyLength?: number;
  minPhoneDigits?: number;
  requireAtLeastOneReach?: boolean;
  validateLastContactISO?: boolean;
}>;

const DEFAULTS: Required<Omit<ContactValidationPolicies, "requireAtLeastOneReach">> & {
  requireAtLeastOneReach: boolean;
} = {
  maxNameLength: 140,
  maxCompanyLength: 140,
  minPhoneDigits: 7,
  validateLastContactISO: false,
  requireAtLeastOneReach: false,
};

export function collectContactValidationIssues(
  input: Partial<Record<ContactField, unknown>>,
  policies: ContactValidationPolicies = {}
): ValidationIssue[] {
  const cfg = { ...DEFAULTS, ...policies };

  const companyName = normalizeText(input.companyName);
  const name = normalizeText(input.name);
  const email = normalizeText(input.email) || undefined;
  const phone = normalizeText(input.phone) || undefined;
  const lastContact = normalizeText(input.lastContact) || undefined;

  const issues: ValidationIssue[] = [];

  if (!companyName) {
    issues.push({
      field: "companyName",
      code: "REQUIRED",
      message: "Company name must not be empty",
    });
  }
  if (!name) {
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
  if (phone && countDigits(phone) < cfg.minPhoneDigits) {
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

export function assertNoValidationIssues(issues: readonly ValidationIssue[]): void {
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
