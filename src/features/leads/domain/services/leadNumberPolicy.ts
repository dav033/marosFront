// maros-app/src/features/leads/domain/services/leadNumberPolicy.ts

import type { LeadNumberRules } from "../../types";
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

export const DEFAULT_LEAD_NUMBER_RULES: Required<
  Omit<LeadNumberRules, "pattern" | "minLength" | "maxLength">
> &
  Pick<LeadNumberRules, "pattern" | "minLength" | "maxLength"> = {
  trim: true,
  collapseWhitespace: true,
  uppercase: false,
  allowEmpty: true,
  minLength: 0,
  maxLength: 0, // 0 = sin límite superior
  pattern: undefined,
};

/** Normalización básica según reglas. */
export function normalizeLeadNumber(
  raw: string,
  rules: LeadNumberRules = DEFAULT_LEAD_NUMBER_RULES
): string {
  const r = { ...DEFAULT_LEAD_NUMBER_RULES, ...rules };
  let v = String(raw ?? "");
  if (r.trim) v = v.trim();
  if (r.collapseWhitespace) v = v.replace(/\s+/g, " ");
  if (r.uppercase) v = v.toUpperCase();
  return v;
}

/**
 * Valida el formato (longitud/patrón) del número de lead ya normalizado.
 * Lanza BusinessRuleError si no cumple.
 */
export function validateLeadNumberFormat(
  value: string,
  rules: LeadNumberRules = DEFAULT_LEAD_NUMBER_RULES
): void {
  const r = { ...DEFAULT_LEAD_NUMBER_RULES, ...rules };

  if (value === "") {
    if (!r.allowEmpty) {
      throw new BusinessRuleError(
        "VALIDATION_ERROR",
        "Lead number cannot be empty",
        { details: { field: "leadNumber" } }
      );
    }
    return; // vacío permitido → válido
  }

  if (r.minLength && r.minLength > 0 && value.length < r.minLength) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Lead number must have at least ${r.minLength} characters`,
      { details: { field: "leadNumber", length: value.length } }
    );
  }
  if (r.maxLength && r.maxLength > 0 && value.length > r.maxLength) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Lead number must have at most ${r.maxLength} characters`,
      { details: { field: "leadNumber", length: value.length } }
    );
  }
  if (r.pattern && !r.pattern.test(value)) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      "Lead number format is invalid",
      { details: { field: "leadNumber", value } }
    );
  }
}

/**
 * Construye un número de lead normalizado y válido a partir de la entrada.
 * - `null`/`undefined` → retorna `null` (campo ausente).
 * - `""` → permitido si `allowEmpty=true` (limpieza del número).
 * - Otro string → normaliza + valida (longitud/patrón).
 */
export function makeLeadNumber(
  input: string | null | undefined,
  rules: LeadNumberRules = DEFAULT_LEAD_NUMBER_RULES
): string | null {
  if (input == null) return null; // no suministrado → null
  const normalized = normalizeLeadNumber(input, rules);
  validateLeadNumberFormat(normalized, rules);
  return normalized;
}

/**
 * Política de unicidad. No hace IO por sí misma: recibe un "checker" provisto
 * por la capa de aplicación/infrastructura (repositorio/servicio).
 *
 * Ejemplo de uso en Application:
 *   await ensureLeadNumberAvailable(n, repo.existsLeadNumber);
 */
export async function ensureLeadNumberAvailable(
  value: string,
  exists: (n: string) => Promise<boolean>
): Promise<void> {
  if (!value) return; // vacío o null no se valida por unicidad
  const taken = await exists(value);
  if (taken) {
    throw new BusinessRuleError("CONFLICT", "Lead number already in use", {
      details: { field: "leadNumber", value },
    });
  }
}
