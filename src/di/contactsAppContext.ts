// src/features/contact/application/context.ts

import type { ContactRepositoryPort } from "@/features/contact/domain";

export interface ContactUniquenessPort {
  /** Devuelve true si el email YA está tomado (existe). */
  isEmailTaken?(email: string): Promise<boolean>;
  /** Devuelve true si el teléfono YA está tomado (existe). */
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
