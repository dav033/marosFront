import type { ContactRepositoryPort, ContactUniquenessPort } from "@/contact";


export type ContactsAppContext = Readonly<{
  repos: {
    contact: ContactRepositoryPort;
  };
  ports?: {
    uniqueness?: ContactUniquenessPort;
  };
}>;

export function makeContactsAppContext(deps: ContactsAppContext): ContactsAppContext {
  return deps;
}
