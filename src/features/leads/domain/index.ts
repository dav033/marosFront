// src/features/leads/domain/index.ts

// Models
export type { Lead } from "./models/Lead";
export type { ProjectType } from "./models/ProjectType";

// Enums (re-export)
export { LeadStatus, LeadType } from "../enums";

// Tipos de dominio
export type {
  LeadId,
  ContactId,
  ProjectTypeId,
  ISODate,
  ISODateTime,
  Clock,
  LeadPolicies,
  LeadPatch,
  LeadDraft,
  LeadDraftWithNewContact,
  LeadDraftWithExistingContact,
  ApplyLeadPatchResult,
  DomainEvent,
  Ok,
  Err,
  Result,
} from "../types";
export { SystemClock, ok, err } from "../types";

// Errors
export { BusinessRuleError } from "./errors/BusinessRuleError";

// Services / Policies
export {
  buildLeadDraftForNewContact,
  buildLeadDraftForExistingContact,
} from "./services/buildLeadDraft";
export { makeLeadNumber } from "./services/leadNumberPolicy";
export {
  normalizeNewContact,
  ensureNewContactMinimums,
  resolveContactLink,
} from "./services/leadContactLinkPolicy";
export {
  DEFAULT_TRANSITIONS,
  canTransition,
  ensureTransition,
  applyStatus,
} from "./services/leadStatusPolicy";
export { applyLeadPatch } from "./services/applyLeadPatch";
export { ensureLeadIntegrity } from "./services/ensureLeadIntegrity";
export { ensureLeadDraftIntegrity } from "./services/ensureLeadDraftIntegrity";
export {
  summarizeLeads,
  summarizeLeadsByType,
  countsInOrder,
} from "./services/leadStatusSummary";
export {
  mapLeadDraftToCreatePayload,
  mapDraftWithNewContactToPayload,
  mapDraftWithExistingContactToPayload,
} from "./services/leadCreateMapper";
export {
  mapLeadPatchToUpdatePayload,
  type UpdateLeadPayload,
} from "./services/leadUpdateMapper";
export { mapLeadFromDTO, mapLeadsFromDTO } from "./services/leadReadMapper";
export {
  DEFAULT_STATUS_ORDER,
  filterByType,
  filterByStatus,
  partitionByStatus,
  sortByStartDateDesc,
} from "./services/leadsQueries";

// Ports (solo Leads, como acordamos)
export type { LeadRepositoryPort } from "./ports/LeadRepositoryPort";
export type { LeadNumberAvailabilityPort } from "./ports/LeadNumberAvailabilityPort";
