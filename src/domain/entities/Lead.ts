import type { LeadStatus } from '../enums/LeadStatus';
import type { LeadType } from '../enums/LeadType';
import type { LocalDateString } from '../value-objects/LocalDateString';
import type { Contact } from './Contact';
import type { ProjectType } from './ProjectType';

export type Lead = {
  id?: number;
  leadNumber: string;
  name: string;
  startDate: LocalDateString;
  location: string;
  status: LeadStatus;
  contact: Contact;
  projectType?: ProjectType | null;
  leadType: LeadType;
};