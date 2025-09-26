

/* ----------------- Utils base ----------------- */

function normText(s: unknown): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function normLower(s: unknown): string {
  return normText(s).toLowerCase();
}

/* ----------------- Normalización de campos ----------------- */

export function normalizeEmail(e?: string): string | undefined {
  if (!e) return undefined;
  const v = normLower(e);
  return v || undefined;
}

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

export function makeContactIdentityKey(
  input: { name?: string | undefined; companyName?: string | undefined; email?: string | undefined; phone?: string | undefined },
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
  const company = normalizeCompany(input.companyName) ?? "";
  return `name-company:${name}|${company}`;
}

export function areIdentityKeysEqual(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

/* ----------------- Duplicados ----------------- */

export type ContactLike = Readonly<{
  name?: string | undefined;
  companyName?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
}>;

export type DuplicateCheckOptions = MakeIdentityKeyOptions & {
    fallback?: "name-company" | "name";
};

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
  const companyA = normalizeCompany(a.companyName) ?? "";
  const companyB = normalizeCompany(b.companyName) ?? "";
  if (strategy === "email>phone>name") {
    return !!nameA && nameA === nameB;
  }
  return !!nameA && nameA === nameB && companyA === companyB;
}

/* ----------------- Paquete de normalización para UI/Tests ----------------- */

export function computeIdentityFields(input: ContactLike): Readonly<{
  email?: string | undefined;
  phone?: string | undefined;
  name?: string | undefined;
  companyName?: string | undefined;
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
