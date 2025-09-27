import type { Lead } from "../models/Lead";
import { LeadStatus } from "../../enums";
import { DEFAULT_STATUS_ORDER, partitionByStatus } from "./leadsQueries";

/** Estados auxiliares que existen en datos/UX además del enum explícito */
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

/**
 * Construye secciones de Leads en el orden por defecto, con etiquetas canónicas.
 * - Si no hay datos → sección "All" vacía.
 * - Si ningún lead tiene status → sección "All" con todos los items.
 * - Caso normal → secciones por status con orden DEFAULT_STATUS_ORDER; agrega desconocidos al final.
 */
export function buildLeadSections(data: readonly Lead[]): LeadSection[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [{ title: "All", data: [] }];
  }

  const hasStatus = data.some((l) => (l.status ?? null) != null);
  if (!hasStatus) return [{ title: "All", data: [...data] }];

  const buckets = partitionByStatus(data);
  const sections: LeadSection[] = [];

  // Secciones en el orden canónico
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

  // Cualquier clave residual no contemplada explícitamente (robustez futura)
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
