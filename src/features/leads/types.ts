// maros-app/src/features/leads/domain/types.ts

import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadStatus, LeadType } from "./enums";

/** Alias semánticos compatibles con su modelo/DTO actual (números/strings). */
export type LeadId = number;
export type ContactId = number;
export type ProjectTypeId = number;
export type ISODate = string; // "YYYY-MM-DD"
export type ISODateTime = string; // ISO 8601 completo (si lo necesitara)

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

/** Datos de contacto “nuevo” (aún sin ID del sistema). */
export type NewContact = Readonly<{
  companyName: string;
  name: string;
  phone: string;
  email: string;
}>;

/** Políticas opcionales aplicables en creación/edición de leads. */
export type LeadPolicies = Readonly<{
  /** Patrón de formato para validar opcionalmente leadNumber cuando se provee. */
  leadNumberPattern?: RegExp;
  /** Estatus por defecto al crear (por defecto: null para mantener compatibilidad). */
  defaultStatus?: LeadStatus | null;
}>;

/** Base del borrador de Lead (antes de persistir). */
export type LeadDraftBase = Readonly<{
  leadNumber: string | null; // string simple para compatibilidad actual
  name: string;
  startDate: ISODate;
  location: string;
  status: LeadStatus | null;
  projectTypeId: ProjectTypeId;
  leadType: LeadType;
}>;

/** Variante: crear con contacto nuevo (sin ID). */
export type LeadDraftWithNewContact = LeadDraftBase &
  Readonly<{
    contact: NewContact;
  }>;

/** Variante: crear con contacto existente (ID). */
export type LeadDraftWithExistingContact = LeadDraftBase &
  Readonly<{
    contactId: ContactId;
  }>;

/** Unión de borradores. */
export type LeadDraft = LeadDraftWithNewContact | LeadDraftWithExistingContact;

/** Evento de dominio: cambio de estado (no usa null). */
export type LeadStatusChangedEvent = Readonly<{
  type: "LeadStatusChanged";
  payload: {
    id: LeadId;
    from: LeadStatus;
    to: LeadStatus;
    at: number; // timestamp ms (use Clock.now())
  };
}>;

/** Unión genérica de eventos de dominio (extienda conforme crezcan las reglas). */
export type DomainEvent = LeadStatusChangedEvent;

/** Patch permitido al editar un Lead (alineado con tu update actual). */
export type LeadPatch = Readonly<{
  name?: string;
  location?: string;
  status?: LeadStatus | null; // permitir null desde UI → se mapeará a UNDETERMINED
  contactId?: number;
  projectTypeId?: number;
  startDate?: ISODate;
  leadNumber?: string | null;
}>;

/** Políticas opcionales para el parche. */
export type LeadPatchPolicies = Readonly<{
  /** Patrón para validar el leadNumber si viene en el patch. */
  leadNumberPattern?: RegExp;
  /** Matriz de transiciones válidas: SOLO por LeadStatus (sin null). */
  allowedTransitions?: Partial<Record<LeadStatus, LeadStatus[]>>;
}>;

/** Resultado del servicio applyLeadPatch. */
export type ApplyLeadPatchResult = Readonly<{
  lead: Lead;
  events: DomainEvent[];
}>;

/** Reglas de normalización/validación del número de lead. */
export type LeadNumberRules = Readonly<{
  /** Si true, aplica trim a extremos. (default: true) */
  trim?: boolean;
  /** Si true, colapsa espacios internos a un solo espacio. (default: true) */
  collapseWhitespace?: boolean;
  /** Si true, convierte a mayúsculas. (default: false) */
  uppercase?: boolean;
  /** Longitud mínima permitida (si > 0). */
  minLength?: number;
  /** Longitud máxima permitida (si > 0). */
  maxLength?: number;
  /**
   * Patrón permitido. Si se define, el valor normalizado debe cumplirlo.
   * Ejemplo: /^[A-Z0-9-]+$/
   */
  pattern?: RegExp;
  /**
   * Permitir explícitamente la cadena vacía "" como “limpieza” del número.
   * Útil para UI que desea borrar el campo sin enviarlo como null. (default: true)
   */
  allowEmpty?: boolean;
}>;
