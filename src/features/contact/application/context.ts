
import type { ContactRepositoryPort } from "@/features/contact/domain";


export type ContactsAppContext = Readonly<{
  repos: {
    contact: ContactRepositoryPort;
  };

}>;

export function makeContactsAppContext(deps: ContactsAppContext): ContactsAppContext {
  return deps;
}
