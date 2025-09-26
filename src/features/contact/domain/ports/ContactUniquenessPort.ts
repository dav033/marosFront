
import type { Contact } from "../models/Contact";

export type ContactUniquenessCheck = Readonly<{
  name?: string | undefined;
  companyName?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
}>;

export interface ContactUniquenessPort {
    isDuplicate(
    candidate: ContactUniquenessCheck
  ): Promise<{ duplicate: boolean; conflictId?: number }>;

    findDuplicates(candidate: ContactUniquenessCheck): Promise<Contact[]>;
}

