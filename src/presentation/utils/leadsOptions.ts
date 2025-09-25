// src/presentation/utils/leadsOptions.ts
import { LeadStatus } from "@/features/leads/enums";
import type { SelectOption } from "@/presentation/atoms/Select"; // usa el tipo exacto del Select

type ContactLite = { id: number; name: string; companyName?: string; phone?: string | undefined; email?: string | undefined };
type ProjectTypeLite = { id: number; name: string; color?: string };

export function getLeadStatusOptions(): ReadonlyArray<SelectOption> {
  const labels: Record<LeadStatus, string> = {
    [LeadStatus.NEW]: "New",
    [LeadStatus.UNDETERMINED]: "Undetermined",
    [LeadStatus.TO_DO]: "To do",
    [LeadStatus.IN_PROGRESS]: "In progress",
    [LeadStatus.DONE]: "Done",
    [LeadStatus.LOST]: "Lost",
    [LeadStatus.NOT_EXECUTED]: "Not executed",
  };

  // ⬇️ IMPORTANTE: devolver el array (return explícito)
  return (Object.keys(LeadStatus) as Array<keyof typeof LeadStatus>)
    .map((k) => LeadStatus[k])
    .map((value) => ({ value, label: labels[value] || value }));
}

export function formatContactOptions(
  contacts: readonly ContactLite[] = []
): ReadonlyArray<SelectOption> {
  return contacts.map((c) => {
    const extra =
      c.companyName ? ` — ${c.companyName}` :
      c.email ? ` — ${c.email}` :
      c.phone ? ` — ${c.phone}` : "";
    return { value: c.id, label: `${c.name}${extra}` };
  });
}

export function formatProjectTypeOptions(
  projectTypes: readonly ProjectTypeLite[] = []
): ReadonlyArray<SelectOption> {
  return projectTypes.map((pt) => ({ value: pt.id, label: pt.name || `#${pt.id}` }));
}
