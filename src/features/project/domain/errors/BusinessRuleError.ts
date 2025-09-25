// src/features/project/domain/errors/BusinessRuleError.ts
// DEPRECATED: Re-export from shared domain for backward compatibility
// New imports should use: import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

export {
  assertBusiness,
  businessError,
  type BusinessErrorKind,
  BusinessRuleError,
} from "@/shared/domain/BusinessRuleError";