
import type { ContactRepositoryPort } from "@/features/contact/domain";

export interface ContactUniquenessPort {
    isEmailTaken?(email: string): Promise<boolean>;
    isPhoneTaken?(phone: string): Promise<boolean>;
}

export interface ContactsAppContext {
  repos: {
    contact: ContactRepositoryPort;
  };
  ports: {
    uniqueness: ContactUniquenessPort;
  };
}
