// src/features/contact/application/context.ts

import type { ContactRepositoryPort } from "@/features/contact/domain";


/** Contexto de aplicación de Contacts (solo define contratos). */
export type ContactsAppContext = Readonly<{
  repos: {
    contact: ContactRepositoryPort;
  };

}>;

/**
 * Fábrica tipada “como en Leads”.
 * No instancia dependencias; solo recibe `deps` y los retorna.
 * La construcción concreta se realiza en la capa de DI.
 */
export function makeContactsAppContext(deps: ContactsAppContext): ContactsAppContext {
  return deps;
}
