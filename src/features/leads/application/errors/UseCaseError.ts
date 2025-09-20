// src/features/leads/application/errors/UseCaseError.ts
export type UseCaseErrorKind = "INFRA_ERROR" | "UNEXPECTED";

export class UseCaseError extends Error {
  readonly kind: UseCaseErrorKind;
  readonly details?: Record<string, unknown>;

  constructor(
    kind: UseCaseErrorKind,
    message: string,
    options?: { details?: Record<string, unknown>; cause?: unknown }
  ) {
    super(message);
    this.name = "UseCaseError";
    this.kind = kind;
    this.details = options?.details;
    if (options?.cause !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).cause = options.cause;
    }
  }
}
