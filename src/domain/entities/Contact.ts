import type { Email } from '../value-objects/Email';
import type { Phone } from '../value-objects/Phone';
import type { LocalDateTimeString } from '../value-objects/LocalDateTimeString';

export type Contact = {
  id?: number;
  companyName?: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: Phone | null;
  email?: Email | null;
  address?: string | null;
  lastContact?: LocalDateTimeString | null;
};