
export type BusinessErrorKind =
  | "VALIDATION_ERROR" 
  | "FORMAT_ERROR" 
  | "POLICY_VIOLATION" 
  | "INVALID_TRANSITION" 
  | "INTEGRITY_VIOLATION" 
  | "CONFLICT" 
  | "NOT_FOUND"; 

export class BusinessRuleError extends Error {
  readonly kind: BusinessErrorKind;
  readonly details?: Record<string, unknown> | undefined;

  constructor(
    kind: BusinessErrorKind,
    message: string,
    options?: { details?: Record<string, unknown>; cause?: unknown }
  ) {
    super(message);
    this.name = "BusinessRuleError";
    this.kind = kind;
    this.details = options?.details;
    if (options?.cause !== undefined) {
      (this as unknown as { cause?: unknown }).cause = options.cause;
    }
  }

  static is(input: unknown): input is BusinessRuleError {
    return input instanceof BusinessRuleError;
  }

  toJSON() {
    return {
      name: this.name,
      kind: this.kind,
      message: this.message,
      details: this.details ?? null,
    };
  }
}

export const businessError = (
  kind: BusinessErrorKind,
  message: string,
  details?: Record<string, unknown>
) =>
  details !== undefined
    ? new BusinessRuleError(kind, message, { details })
    : new BusinessRuleError(kind, message);

export function assertBusiness(
  condition: unknown,
  kind: BusinessErrorKind,
  message: string,
  details?: Record<string, unknown>
): asserts condition {
  if (!condition) throw businessError(kind, message, details);
}