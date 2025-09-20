// src/features/contact/domain/services/contactIdentityPolicy.ts

/**
 * Política de identidad para contactos:
 * - Normalización de email y teléfono (puras, determinísticas).
 * - Generación de una clave de identidad estable (identity key).
 * - Utilidades de comparación/detección de duplicados.
 *
 * NOTAS:
 * - No se aplican heurísticas específicas por proveedor (p.ej., Gmail ignora puntos).
 *   Si necesitas reglas por dominio, extiende normalizeEmail con una whitelist.
 */

/* ----------------- Utils base ----------------- */

function normText(s: unknown): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function normLower(s: unknown): string {
  return normText(s).toLowerCase();
}

/* ----------------- Normalización de campos ----------------- */

/** Lowercase + trim. No reescribe dominios ni aplica heurísticas de proveedor. */
export function normalizeEmail(e?: string): string | undefined {
  if (!e) return undefined;
  const v = normLower(e);
  return v || undefined;
}

/**
 * Mantiene opcionalmente el '+' inicial y remueve todo lo que no sea dígito en el resto.
 * No valida longitud ni país; eso se define por políticas aguas arriba.
 */
export function normalizePhone(
  p?: string,
  opts: { keepPlus?: boolean } = { keepPlus: true }
): string | undefined {
  if (!p) return undefined;
  const trimmed = String(p).trim();
  if (!trimmed) return undefined;

  if (opts.keepPlus && trimmed.startsWith("+")) {
    const rest = trimmed.slice(1).replace(/\D+/g, "");
    return rest ? `+${rest}` : undefined;
  }
  const digits = trimmed.replace(/\D+/g, "");
  return digits || undefined;
}

/** Nombre y compañía normalizados (trim + colapso de espacios, en minúscula para comparación). */
export function normalizeName(name?: string): string | undefined {
  const v = normLower(name);
  return v || undefined;
}
export function normalizeCompany(company?: string): string | undefined {
  const v = normLower(company);
  return v || undefined;
}

/* ----------------- Clave de identidad ----------------- */

export type IdentityKeyStrategy =
  | "email>phone>name-company" // por defecto
  | "email>phone>name";        // variante si la compañía no es relevante

export type MakeIdentityKeyOptions = Readonly<{
  strategy?: IdentityKeyStrategy;
  minPhoneDigits?: number; // mínimo para considerar phone como identidad (default 7)
}>;

/**
 * Genera una clave de identidad estable siguiendo una estrategia:
 * - email>phone>name-company (default)
 * - email>phone>name
 */
export function makeContactIdentityKey(
  input: { name?: string; companyName?: string; email?: string; phone?: string },
  options: MakeIdentityKeyOptions = {}
): string {
  const { strategy = "email>phone>name-company", minPhoneDigits = 7 } = options;

  const email = normalizeEmail(input.email);
  if (email) return `email:${email}`;

  const phone = normalizePhone(input.phone);
  if (phone && phone.replace(/\D+/g, "").length >= minPhoneDigits) {
    return `phone:${phone}`;
  }

  const name = normalizeName(input.name) ?? "";
  if (strategy === "email>phone>name") {
    return `name:${name}`;
  }

  // nombre + empresa (fallback más preciso)
  const company = normalizeCompany(input.companyName) ?? "";
  return `name-company:${name}|${company}`;
}

/** Comparación de claves de identidad (case-insensitive). */
export function areIdentityKeysEqual(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

/* ----------------- Duplicados ----------------- */

export type ContactLike = Readonly<{
  name?: string;
  companyName?: string;
  email?: string;
  phone?: string;
}>;

export type DuplicateCheckOptions = MakeIdentityKeyOptions & {
  /**
   * Si ambas entidades carecen de email/phone, comparar por:
   * - "name-company" (default) o
   * - "name" (más laxo; puede generar falsos positivos si hay muchos homónimos).
   */
  fallback?: "name-company" | "name";
};

/**
 * Heurística pura para detectar duplicados:
 * - Si comparten email normalizado → duplicado.
 * - Sino, si comparten teléfono normalizado con min dígitos → duplicado.
 * - Si no hay email/phone válidos, cae al fallback configurado.
 */
export function areContactsPotentialDuplicates(
  a: ContactLike,
  b: ContactLike,
  opts: DuplicateCheckOptions = {}
): boolean {
  const { minPhoneDigits = 7, strategy = "email>phone>name-company", fallback } = opts;

  const ea = normalizeEmail(a.email);
  const eb = normalizeEmail(b.email);
  if (ea && eb && ea === eb) return true;

  const pa = normalizePhone(a.phone);
  const pb = normalizePhone(b.phone);
  if (
    pa &&
    pb &&
    pa.replace(/\D+/g, "").length >= minPhoneDigits &&
    pb.replace(/\D+/g, "").length >= minPhoneDigits &&
    pa === pb
  ) {
    return true;
  }

  const nameA = normalizeName(a.name) ?? "";
  const nameB = normalizeName(b.name) ?? "";
  if (fallback === "name") {
    return !!nameA && nameA === nameB;
  }

  // default: name-company o según la estrategia elegida
  const companyA = normalizeCompany(a.companyName) ?? "";
  const companyB = normalizeCompany(b.companyName) ?? "";
  if (strategy === "email>phone>name") {
    // si estrategia indica 'name' solo, obedecer
    return !!nameA && nameA === nameB;
  }
  // name-company
  return !!nameA && nameA === nameB && companyA === companyB;
}

/* ----------------- Paquete de normalización para UI/Tests ----------------- */

export function computeIdentityFields(input: ContactLike): Readonly<{
  email?: string;
  phone?: string;
  name?: string;
  companyName?: string;
  key: string;
}> {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const name = normalizeName(input.name);
  const companyName = normalizeCompany(input.companyName);
  const key = makeContactIdentityKey(
    { email, phone, name, companyName },
    { strategy: "email>phone>name-company" }
  );

  return { email, phone, name, companyName, key };
}
