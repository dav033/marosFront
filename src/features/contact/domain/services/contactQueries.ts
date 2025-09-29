
import type { Contact } from "../models/Contact";

function norm(s: unknown): string {
  return String(s ?? "").trim();
}
function normLower(s: unknown): string {
  return norm(s).toLowerCase();
}

export function filterActive(contacts: readonly Contact[]): Contact[] {
  const src = Array.isArray(contacts) ? contacts : [];
  return src.filter((c) => !!norm(c.email) || !!norm(c.phone));
}

export function sortByNameAsc(contacts: readonly Contact[]): Contact[] {
  const src = Array.isArray(contacts) ? contacts : [];
  return [...src].sort((a, b) => {
    const an = normLower(a.name);
    const bn = normLower(b.name);
    if (an < bn) return -1;
    if (an > bn) return 1;
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

export function sortByCompanyAsc(contacts: readonly Contact[]): Contact[] {
  const src = Array.isArray(contacts) ? contacts : [];
  return [...src].sort((a, b) => {
    const ac = normLower(a.companyName);
    const bc = normLower(b.companyName);
    if (ac < bc) return -1;
    if (ac > bc) return 1;
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

export function searchByText(
  contacts: readonly Contact[],
  query: string
): Contact[] {
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

export function groupByCompany(
  contacts: readonly Contact[]
): Record<string, Contact[]> {
  const src = Array.isArray(contacts) ? contacts : [];
  return src.reduce<Record<string, Contact[]>>((acc, c) => {
    const key = norm(c.companyName) || "(Sin empresa)";
    (acc[key] ||= []).push(c);
    return acc;
  }, {});
}
