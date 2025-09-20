// src/features/project/types.ts

import type { Project } from "./domain/models/Project";
import type { ProjectStatus, InvoiceStatus } from "./enums";

/** Alias semánticos compatibles con su modelo/DTO actual (números/strings). */
export type ProjectId = number;
export type LeadId = number;
export type ISODate = string; // "YYYY-MM-DD"
export type ISODateTime = string; // ISO 8601 completo

/** Reloj inyectable para testear reglas con fechas sin usar Date.now() directo. */
export interface Clock {
  now(): number; // ms desde epoch
  todayISO(): ISODate; // "YYYY-MM-DD"
}

/** Implementación por defecto del Clock (inyecte en servicios). */
export const SystemClock: Clock = {
  now: () => Date.now(),
  todayISO: () => new Date().toISOString().split("T")[0] as ISODate,
};

/** Result helpers (por si prefiere evitar throws en flujos normales). */
export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;
export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

/** Políticas opcionales aplicables en creación/edición de projects. */
export interface ProjectPolicies {
  requireLead?: boolean;
  requireProjectName?: boolean;
  allowEmptyPayments?: boolean;
}

/** Borrador para crear un nuevo Project (sin ID). */
export interface ProjectDraft {
  projectName: string;
  overview?: string;
  payments?: number[];
  projectStatus?: ProjectStatus;
  invoiceStatus?: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: ISODate;
  endDate?: ISODate;
  leadId?: LeadId;
}

/** Patch para actualizar un Project existente. */
export interface ProjectPatch {
  projectName?: string;
  overview?: string;
  payments?: number[];
  projectStatus?: ProjectStatus;
  invoiceStatus?: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: ISODate;
  endDate?: ISODate;
  leadId?: LeadId;
}

/** Resultado de aplicar un patch a un Project. */
export interface ApplyProjectPatchResult {
  project: Project;
  hasChanges: boolean;
}

/** Eventos de dominio (si los llegara a necesitar). */
export interface DomainEvent {
  type: string;
  aggregateId: string;
  timestamp: number;
  payload: unknown;
}