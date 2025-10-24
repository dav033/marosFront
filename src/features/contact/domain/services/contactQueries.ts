import type { Contact } from "@/contact";
import { normalizeText, normalizeLower } from "@/shared";

export function groupByCompany(src?: readonly Contact[] | null): Record<string, Contact[]> {
  const list = Array.isArray(src) ? src : [];
  return list.reduce<Record<string, Contact[]>>((acc, c) => {
    const key = normalizeText(c.companyName) || "(Sin empresa)";
    (acc[key] ||= []).push(c);
    return acc;
  }, {});
}

export function searchByNameOrCompany(
  q: string,
  src?: readonly Contact[] | null
): Contact[] {
  const list = Array.isArray(src) ? src : [];
  const needle = normalizeLower(q);
  if (!needle) return list.slice(0);
  return list.filter((c) => {
    const n = normalizeLower(c.name);
    const comp = normalizeLower(c.companyName);
    return n.includes(needle) || comp.includes(needle);
  });
}
