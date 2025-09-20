// maros-app/src/shared/domain/BusinessRuleError.ts

/** Tipos de errores de negocio. */
export type BusinessErrorKind =
  | "VALIDATION_ERROR" // Datos inválidos (VOs, campos requeridos, formato)
  | "FORMAT_ERROR" // Formato específico (ej. leadNumber/email)
  | "POLICY_VIOLATION" // Incumple una política (p.ej., límites/reglas internas)
  | "INVALID_TRANSITION" // Transición de estado no permitida
  | "INTEGRITY_VIOLATION" // Inconsistencia del agregado/relación
  | "CONFLICT" // Conflicto de negocio (p.ej., duplicado)
  | "NOT_FOUND"; // Entidad o relación no existe (en negocio)

/**
 * Error de negocio (dominio) descriptivo y tipado.
 * Es independiente de UI/HTTP/infraestructura.
 */
export class BusinessRuleError extends Error {
  readonly kind: BusinessErrorKind;
  readonly details?: Record<string, unknown>;

  constructor(
    kind: BusinessErrorKind,
    message: string,
    options?: { details?: Record<string, unknown>; cause?: unknown }
  ) {
    super(message);
    this.name = "BusinessRuleError";
    this.kind = kind;
    this.details = options?.details;

    // Soporte nativo para 'cause' (TS/Node modernos) sin romper navegadores antiguos
    if (options?.cause !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).cause = options.cause;
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

/** Helper corto para crear errores de negocio con detalles opcionales. */
export const businessError = (
  kind: BusinessErrorKind,
  message: string,
  details?: Record<string, unknown>
) => new BusinessRuleError(kind, message, { details });

/** Asserts de dominio: lanzan BusinessRuleError si la condición no se cumple. */
export function assertBusiness(
  condition: unknown,
  kind: BusinessErrorKind,
  message: string,
  details?: Record<string, unknown>
): asserts condition {
  if (!condition) throw businessError(kind, message, details);
}