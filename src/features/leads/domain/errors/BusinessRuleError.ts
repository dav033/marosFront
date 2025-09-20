// src/features/leads/domain/errors/BusinessRuleError.ts
// DEPRECATED: Re-export from shared domain for backward compatibility
// New imports should use: import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

export {
  BusinessRuleError,
  businessError,
  assertBusiness,
  type BusinessErrorKind,
} from "@/shared/domain/BusinessRuleError";
