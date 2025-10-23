import type { Lead } from "@/leads";
import { LeadStatus } from "../../enums";
import { DEFAULT_STATUS_ORDER, partitionByStatus } from "./leadsQueries";

export type AuxStatus = "UNDETERMINED" | "NOT_EXECUTED";
export type SectionKey = LeadStatus | AuxStatus;

export const STATUS_LABELS: Record<SectionKey, string> = {
  [LeadStatus.NEW]: "New",
  UNDETERMINED: "Undetermined",
  [LeadStatus.TO_DO]: "To do",
  [LeadStatus.IN_PROGRESS]: "In progress",
  [LeadStatus.DONE]: "Done",
  [LeadStatus.LOST]: "Lost",
  NOT_EXECUTED: "Not executed",
} as const;

export type LeadSection = Readonly<{
  title: string;
  status?: SectionKey;
  data: Lead[];
}>;

export function buildLeadSections(data: readonly Lead[]): LeadSection[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [{ title: "All", data: [] }];
  }

  const hasStatus = data.some((l) => (l.status ?? null) != null);
  if (!hasStatus) return [{ title: "All", data: [...data] }];

  const buckets = partitionByStatus(data);
  const sections: LeadSection[] = [];

  
  for (const status of DEFAULT_STATUS_ORDER) {
    const list = buckets[status] ?? [];
    if (list.length) {
      sections.push({
        title: STATUS_LABELS[status],
        status,
        data: list,
      });
    }
  }

  
  const known = new Set(DEFAULT_STATUS_ORDER.map(String));
  (Object.keys(buckets) as Array<keyof typeof buckets>).forEach((k) => {
    const keyStr = String(k);
    const list = buckets[k] ?? [];
    if (!known.has(keyStr) && list.length) {
      const title =
        (STATUS_LABELS as Record<string, string>)[keyStr] ?? keyStr;
      sections.push({ title, status: keyStr as SectionKey, data: list });
    }
  });

  return sections;
}
