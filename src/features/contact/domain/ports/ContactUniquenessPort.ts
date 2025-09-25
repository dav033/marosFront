// src/features/contact/application/ports/ContactUniquenessPort.ts

import type { Contact } from "../models/Contact";

export type ContactUniquenessCheck = Readonly<{
  name?: string | undefined;
  companyName?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
}>;

/**
 * Puerto para delegar validaciones de unicidad al backend (si existe endpoint).
 * Útil para prevenir duplicados server-side antes de crear/actualizar.
 */
export interface ContactUniquenessPort {
  /**
   * Devuelve si el candidato choca con algún registro.
   * conflictId, si viene, ayuda a la UI a enlazar el contacto existente.
   */
  isDuplicate(
    candidate: ContactUniquenessCheck
  ): Promise<{ duplicate: boolean; conflictId?: number }>;

  /**
   * Lista de potenciales duplicados, útil para flujos de revisión/merge.
   */
  findDuplicates(candidate: ContactUniquenessCheck): Promise<Contact[]>;
}

