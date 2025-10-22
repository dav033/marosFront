import { LeadStatus, type Section } from '@/features/leads/domain/types';
import type { Lead } from '../../domain/models/Lead';

const ORDER: LeadStatus[] = [
  LeadStatus.New,
  LeadStatus.Contacted,
  LeadStatus.Qualified,
  LeadStatus.Won,
  LeadStatus.Lost,
];

export function buildLeadSections(leads: Lead[]): Section<Lead>[] {
  const buckets = new Map<LeadStatus, Lead[]>();
  for (const s of ORDER) buckets.set(s, []);
  for (const l of leads)
    buckets.get(l.status as unknown as LeadStatus)?.push(l);

  return ORDER.map((s) => ({
    name: label(s),
    data: buckets.get(s)!,
  }));
}

function label(s: LeadStatus): string {
  switch (s) {
    case LeadStatus.New:
      return 'Nuevos';
    case LeadStatus.Contacted:
      return 'Contactados';
    case LeadStatus.Qualified:
      return 'Calificados';
    case LeadStatus.Won:
      return 'Ganados';
    case LeadStatus.Lost:
      return 'Perdidos';
    default:
      return s;
  }
}
