import type { Project } from "./domain/models/Project";
import type { InvoiceStatus,ProjectStatus } from "./enums";

/** Alias semánticos */
export type ProjectId = number;
export type LeadId = number;
export type ISODate = string;      // "YYYY-MM-DD"
export type ISODateTime = string;  // ISO 8601

/** Reloj inyectable para reglas con fechas */
export interface Clock {
  now(): number;
  todayISO(): ISODate;
}
export const SystemClock: Clock = {
  now: () => Date.now(),
  todayISO: () => new Date().toISOString().split("T")[0] as ISODate,
};

/** Result helpers */
export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;
export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

/** Políticas opcionales */
export interface ProjectPolicies {
  requireLead?: boolean;
  requireProjectName?: boolean;
  allowEmptyPayments?: boolean;
}

/** Borrador de creación */
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

/** Patch de actualización */
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

/** Resultado de aplicar patch */
export interface ApplyProjectPatchResult {
  project: Project;
  hasChanges: boolean;
}

/** Evento de dominio (opcional) */
export interface DomainEvent {
  type: string;
  aggregateId: string;
  timestamp: number;
  payload: unknown;
}

export interface ProjectWithLeadView {
  id: number;
  projectName: string;
  overview?: string;
  projectStatus?: string;
  invoiceStatus?: string;
  quickbooks?: boolean;
  startDate?: string; // ISO (LocalDate → string)
  endDate?: string;

  leadId?: number;
  leadName?: string;
  leadNumber?: string;

  location?: string;
  contactName?: string;
  customerName?: string;
  email?: string;
  phone?: string;
}

