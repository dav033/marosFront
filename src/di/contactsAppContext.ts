import type { ContactsAppContext } from "@/features/contact/application";
import { ContactHttpRepository, ContactUniquenessHttpService } from "@/features/contact/infra";

export function makeContactsAppContext(): ContactsAppContext {
  return {
    repos: {
      contact: new ContactHttpRepository(),
    },
    ports: {
      uniqueness: new ContactUniquenessHttpService(),
    },
  };
}
