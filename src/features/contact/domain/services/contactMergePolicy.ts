// src/features/contact/domain/services/contactMergePolicy.ts

import type { Contacts } from "../models/Contact";

/**
 * Estrategia de fusión:
 * - Si la API devuelve un contacto completo, se usa ese como fuente de verdad.
 * - Si la API devuelve `null` o un objeto parcial (por gateways intermedios),
 *   se fusiona de forma inmutable: cada campo toma el valor definido del resultado
 *   de API cuando exista, o el valor local en su defecto.
 *
 * Nota: este módulo NO hace I/O ni normaliza formatos; asume que la
 * capa de mapeo (DTO → dominio) ya dejó el objeto en forma.
 */

/* ----------------- helpers ----------------- */

function isDefined<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}

/**
 * Fusiona dos contactos de forma inmutable, campo a campo.
 * - `api` tiene prioridad cuando el campo viene definido.
 * - `local` se preserva cuando `api` no define el campo.
 * - `id` siempre se conserva del `local` (defensivo).
 */
export function mergeContact(
  local: Contacts,
  api?: Partial<Contacts> | null
): Contacts {
  if (!api) return { ...local };

  // Campos primitivos controlados
  const merged: Contacts = {
    id: local.id, // defensivo
    companyName: isDefined(api.companyName)
      ? api.companyName
      : local.companyName,
    name: isDefined(api.name) ? api.name : local.name,
    occupation: isDefined(api.occupation) ? api.occupation : local.occupation,
    product: isDefined(api.product) ? api.product : local.product,
    phone: isDefined(api.phone) ? api.phone : local.phone,
    email: isDefined(api.email) ? api.email : local.email,
    address: isDefined(api.address) ? api.address : local.address,
    lastContact: isDefined(api.lastContact)
      ? api.lastContact
      : local.lastContact,
  };

  return merged;
}

/**
 * Atajo común cuando un update HTTP devuelve 204/empty body:
 * - Si `apiResult` viene como `undefined | null`, se retorna el local tal cual.
 * - Si viene parcial, se usa `mergeContact`.
 */
export function mergeApiUpdateFallback(
  local: Contacts,
  apiResult?: Contacts | Partial<Contacts> | null
): Contacts {
  if (!apiResult) return { ...local };
  return mergeContact(local, apiResult);
}

/**
 * Reemplaza (inmutable) un contacto dentro de una colección por id.
 */
export function mergeContactIntoCollection(
  collection: readonly Contacts[],
  updated: Contacts
): Contacts[] {
  const list = Array.isArray(collection) ? collection : [];
  let replaced = false;
  const out = list.map((c) => {
    if (c.id === updated.id) {
      replaced = true;
      return updated;
    }
    return c;
  });
  return replaced ? out : [updated, ...out];
}
