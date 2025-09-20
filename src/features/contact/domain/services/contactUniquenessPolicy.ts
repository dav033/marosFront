// src/features/contact/domain/services/contactUniquenessPolicy.ts

import type { Contacts } from "../models/Contact";
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";
// Si prefieres aislar errores por feature, mueve BusinessRuleError a contact/domain/errors.

import {
  makeContactIdentityKey,
  normalizeEmail,
  normalizePhone,
  normalizeName,
  normalizeCompany,
  type DuplicateCheckOptions,
  areContactsPotentialDuplicates,
} from "./contactIdentityPolicy";

/* ----------------- Tipos ----------------- */

export type ContactLike = Readonly<{
  name?: string;
  companyName?: string;
  email?: string;
  phone?: string;
}>;

export type UniquenessOptions = DuplicateCheckOptions;

export type DuplicateMatch = Readonly<{
  key: string; // identity key evaluada
  match: Contacts; // primer contacto que colisiona
}>;

export type DuplicateGroup = Readonly<{
  key: string; // identity key compartida
  items: Contacts[]; // contactos agrupados por la misma identidad
}>;

/* ----------------- Helpers ----------------- */

function toLike(c: Contacts | ContactLike): ContactLike {
  return {
    name: "name" in c ? c.name : undefined,
    companyName: "companyName" in c ? c.companyName : undefined,
    email: "email" in c ? c.email : undefined,
    phone: "phone" in c ? c.phone : undefined,
  };
}

/* ----------------- API pública ----------------- */

/**
 * Construye un índice (identity key → contactos).
 */
export function buildIdentityIndex(
  contacts: readonly Contacts[],
  opts: UniquenessOptions = {}
): Map<string, Contacts[]> {
  const index = new Map<string, Contacts[]>();
  for (const c of contacts ?? []) {
    const key = makeContactIdentityKey(
      {
        email: normalizeEmail(c.email),
        phone: normalizePhone(c.phone),
        name: normalizeName(c.name),
        companyName: normalizeCompany(c.companyName),
      },
      opts
    );
    const bucket = index.get(key);
    if (bucket) bucket.push(c);
    else index.set(key, [c]);
  }
  return index;
}

/**
 * Devuelve true si `candidate` es potencial duplicado de alguno en `existing`.
 * Retorna además la primera coincidencia y la identity key evaluada.
 */
export function isDuplicateContact(
  candidate: Contacts | ContactLike,
  existing: readonly Contacts[],
  opts: UniquenessOptions = {}
): { duplicate: boolean; key: string; match?: Contacts } {
  const like = toLike(candidate);

  const key = makeContactIdentityKey(
    {
      email: normalizeEmail(like.email),
      phone: normalizePhone(like.phone),
      name: normalizeName(like.name),
      companyName: normalizeCompany(like.companyName),
    },
    opts
  );

  // Búsqueda por identidad directa
  const index = buildIdentityIndex(existing, opts);
  const bucket = index.get(key);
  if (bucket && bucket.length > 0) {
    // Validación extra por heurística de duplicados (email/phone/name[-company])
    for (const item of bucket) {
      if (areContactsPotentialDuplicates(like, item, opts)) {
        return { duplicate: true, key, match: item };
      }
    }
  }

  // Búsqueda defensiva: si el key cayó en "name[-company]" puede haber colisiones.
  // Recorremos toda la colección aplicando la heurística completa.
  for (const item of existing ?? []) {
    if (areContactsPotentialDuplicates(like, item, opts)) {
      return { duplicate: true, key, match: item };
    }
  }

  return { duplicate: false, key };
}

/**
 * Lista TODOS los posibles duplicados de un candidato dentro de `existing`.
 */
export function listPotentialDuplicates(
  candidate: Contacts | ContactLike,
  existing: readonly Contacts[],
  opts: UniquenessOptions = {}
): Contacts[] {
  const like = toLike(candidate);
  const out: Contacts[] = [];
  for (const item of existing ?? []) {
    if (areContactsPotentialDuplicates(like, item, opts)) {
      out.push(item);
    }
  }
  return out;
}

/**
 * Agrupa la colección completa por identity key, devolviendo sólo grupos con colisión (size > 1).
 */
export function findDuplicateGroups(
  contacts: readonly Contacts[],
  opts: UniquenessOptions = {}
): DuplicateGroup[] {
  const index = buildIdentityIndex(contacts, opts);
  const result: DuplicateGroup[] = [];
  for (const [key, items] of index.entries()) {
    if ((items?.length ?? 0) > 1) {
      result.push({ key, items: [...items] });
    }
  }
  return result;
}

/**
 * Lanza si `candidate` colisiona con un contacto existente (según políticas).
 */
export function assertUniqueContact(
  candidate: Contacts | ContactLike,
  existing: readonly Contacts[],
  opts: UniquenessOptions = {}
): void {
  const { duplicate, key, match } = isDuplicateContact(
    candidate,
    existing,
    opts
  );
  if (duplicate && match) {
    throw new BusinessRuleError("CONFLICT", "Duplicate contact detected", {
      details: {
        identityKey: key,
        duplicateOf: {
          id: (match as any).id,
          name: match.name,
          email: match.email,
          phone: match.phone,
        },
      },
    });
  }
}
