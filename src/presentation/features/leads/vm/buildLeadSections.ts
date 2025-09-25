// Capa: Presentation — Agrupación/etiquetado para UI
import type { Lead } from "@/features/leads/domain/models/Lead";
import { LeadStatus } from "@/features/leads/enums";

import type { AuxStatus, LeadSection,SectionKey } from "./types";

const LABELS: Record<SectionKey, string> = {
  [LeadStatus.NEW]: "New",
  UNDETERMINED: "Undetermined",
  [LeadStatus.TO_DO]: "To do",
  [LeadStatus.IN_PROGRESS]: "In progress",
  [LeadStatus.DONE]: "Done",
  [LeadStatus.LOST]: "Lost",
  NOT_EXECUTED: "Not executed",
};

const ORDER: SectionKey[] = [
  LeadStatus.NEW,
  "UNDETERMINED",
  LeadStatus.TO_DO,
  LeadStatus.IN_PROGRESS,
  LeadStatus.DONE,
  LeadStatus.LOST,
  "NOT_EXECUTED",
];

export function buildLeadSections(data: Lead[]): LeadSection[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [{ title: "All", data: [] }];
  }

  const hasStatus = data.some((l: Lead) => (l.status ?? null) != null);
  if (!hasStatus) return [{ title: "All", data }];

  // Agrupar por estado (con fallback defensivo)
  const buckets = new Map<string, Lead[]>();
  for (const lead of data) {
    const raw = String(lead.status ?? ("UNDETERMINED" as AuxStatus));
    const arr = buckets.get(raw) ?? [];
    arr.push(lead);
    buckets.set(raw, arr);
  }

  const sections: LeadSection[] = [];

  // Orden predefinido
  for (const key of ORDER) {
    const bucket = buckets.get(String(key));
    if (bucket?.length) sections.push({ title: LABELS[key], status: key, data: bucket });
  }

  // Estados desconocidos al final
  for (const [k, bucket] of buckets.entries()) {
    if (!ORDER.map(String).includes(k) && bucket.length > 0) {
      const labelsAny = LABELS as Record<string, string>;
      const title = labelsAny[k] ?? k;
      sections.push({ title, status: k as SectionKey, data: bucket });
    }
  }

  return sections;
} 