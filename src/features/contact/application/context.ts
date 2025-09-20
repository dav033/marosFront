// Ctx de Application para CONTACTS
import type { ContactRepositoryPort } from "@/features/contact/domain/ports/ContactRepositoryPort";
import type { ContactUniquenessPort } from "@/features/contact/domain/ports/ContactUniquenessPort";

export function makeContactsAppContext(deps: ContactsAppContext): ContactsAppContext {
  return deps;
}

export type ContactsAppContext = Readonly<{
  repos: Readonly<{
    contact: ContactRepositoryPort;
  }>;
  ports?: Readonly<{
    /** Opcional: backend que chequea unicidad/duplicados. */
    uniqueness?: ContactUniquenessPort;
  }>;
}>;
