export type DomainErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INTEGRITY_VIOLATION'
  | 'UNAVAILABLE';

export type DomainError = {
  code: DomainErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

export function error(code: DomainErrorCode, message: string, details?: Record<string, unknown>): DomainError {
  return { code, message, details };
}