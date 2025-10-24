import type { SelectOption } from '@/presentation';
import type { LeadStatus } from '@/leads';
import { DEFAULT_STATUS_ORDER } from '@/leads';
import { STATUS_LABELS } from '@/features/leads/domain/services/leadSections';

type ContactLite = {
  id: number;
  name: string;
  companyName?: string;
  phone?: string | undefined;
  email?: string | undefined;
};
type ProjectTypeLite = { id: number; name: string; color?: string };

export function getLeadStatusOptions(): ReadonlyArray<SelectOption> {
  return (DEFAULT_STATUS_ORDER as ReadonlyArray<LeadStatus>).map((value) => ({
    value,
    label: STATUS_LABELS[value] ?? value,
  }));
}

export function formatContactOptions(
  contacts: readonly ContactLite[] = [],
): ReadonlyArray<SelectOption> {
  return contacts.map((c) => {
    const extra = c.companyName
      ? ` — ${c.companyName}`
      : c.email
        ? ` — ${c.email}`
        : c.phone
          ? ` — ${c.phone}`
          : '';
    return { value: c.id, label: `${c.name}${extra}` };
  });
}

export function formatProjectTypeOptions(
  projectTypes: readonly ProjectTypeLite[] = [],
): ReadonlyArray<SelectOption> {
  return projectTypes.map((pt) => ({
    value: pt.id,
    label: pt.name || `#${pt.id}`,
  }));
}
