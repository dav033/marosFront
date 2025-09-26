
export type BusinessErrorKind =
  | "VALIDATION_ERROR" // Datos inválidos (VOs, campos requeridos, formato)
  | "FORMAT_ERROR" // Formato específico (ej. leadNumber/email)
  | "POLICY_VIOLATION" // Incumple una política (p.ej., límites/reglas internas)
  | "INVALID_TRANSITION" // Transición de estado no permitida
  | "INTEGRITY_VIOLATION" // Inconsistencia del agregado/relación
  | "CONFLICT" // Conflicto de negocio (p.ej., duplicado)
  | "NOT_FOUND"; // Entidad o relación no existe (en negocio)

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