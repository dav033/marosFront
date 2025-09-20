// src/features/contact/domain/services/contactQueries.ts

import type { Contacts } from "../models/Contact";

/* Utils puras */
function norm(s: unknown): string {
  return String(s ?? "").trim();
}
function normLower(s: unknown): string {
  return norm(s).toLowerCase();
}

/**
 * Filtra contactos "activos".
 * Si tu backend define un flag específico, ajusta esta regla.
 * Aquí consideramos activo si tiene al menos un medio de contacto (email o phone).
 */
export function filterActive(contacts: readonly Contacts[]): Contacts[] {
  const src = Array.isArray(contacts) ? contacts : [];
  return src.filter((c) => !!norm(c.email) || !!norm(c.phone));
}

/** Ordena por nombre ascendente (A→Z), estable y defensivo. */
export function sortByNameAsc(contacts: readonly Contacts[]): Contacts[] {
  const src = Array.isArray(contacts) ? contacts : [];
  return [...src].sort((a, b) => {
    const an = normLower(a.name);
    const bn = normLower(b.name);
    if (an < bn) return -1;
    if (an > bn) return 1;
    // desempate por id para orden estable
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

/** Ordena por empresa ascendente (A→Z). */
export function sortByCompanyAsc(contacts: readonly Contacts[]): Contacts[] {
  const src = Array.isArray(contacts) ? contacts : [];
  return [...src].sort((a, b) => {
    const ac = normLower(a.companyName);
    const bc = normLower(b.companyName);
    if (ac < bc) return -1;
    if (ac > bc) return 1;
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

/**
 * Búsqueda por texto sobre varios campos (companyName, name, email, phone).
 * - Insensible a mayúsculas/minúsculas.
 * - Coincidencia por inclusión (contains).
 */
export function searchByText(
  contacts: readonly Contacts[],
  query: string
): Contacts[] {
  const q = normLower(query);
  if (!q) return Array.isArray(contacts) ? [...contacts] : [];
  const src = Array.isArray(contacts) ? contacts : [];
  return src.filter((c) => {
    return (
      normLower(c.companyName).includes(q) ||
      normLower(c.name).includes(q) ||
      normLower(c.email).includes(q) ||
      normLower(c.phone).includes(q)
    );
  });
}

/** Paginación simple en memoria (1-based). */
export function paginate<T>(
  items: readonly T[] = [],
  page: number,
  pageSize: number
): { data: T[]; page: number; pageSize: number; total: number; pages: number } {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * Math.max(1, pageSize);
  const end = start + Math.max(1, pageSize);
  return {
    data: items.slice(start, end),
    page: safePage,
    pageSize: Math.max(1, pageSize),
    total,
    pages,
  };
}

/** Agrupa por empresa. */
export function groupByCompany(
  contacts: readonly Contacts[]
): Record<string, Contacts[]> {
  const src = Array.isArray(contacts) ? contacts : [];
  return src.reduce<Record<string, Contacts[]>>((acc, c) => {
    const key = norm(c.companyName) || "(Sin empresa)";
    (acc[key] ||= []).push(c);
    return acc;
  }, {});
}
