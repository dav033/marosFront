// src/features/leads/domain/ports/LeadRepositoryPort.ts

import type { Lead } from "../models/Lead";
import type { LeadId, LeadDraft, LeadPatch } from "../../types";
import type { LeadType } from "../../enums";

/**
 * Puerto de repositorio para el agregado Lead.
 * La infraestructura proveerá el adapter (HTTP, DB, etc.).
 */
export interface LeadRepositoryPort {
  /** Obtiene un Lead por id, o null si no existe. */
  findById(id: LeadId): Promise<Lead | null>;

  /** Lista Leads por tipo (CONSTRUCTION, PLUMBING, ROOFING). */
  findByType(type: LeadType): Promise<Lead[]>;

  /** Persiste un Lead nuevo a partir de un draft y devuelve el Lead creado. */
  saveNew(draft: LeadDraft): Promise<Lead>;

  /** Actualiza un Lead existente con un patch de dominio y devuelve el Lead resultante. */
  update(id: LeadId, patch: LeadPatch): Promise<Lead>;

  /** Elimina un Lead por id. Debe ser idempotente. */
  delete(id: LeadId): Promise<void>;
}
