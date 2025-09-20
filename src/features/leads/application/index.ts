// src/features/leads/application/index.ts
export type { LeadsAppContext } from "./context";
export { makeLeadsAppContext } from "./context";

export { UseCaseError } from "./errors/UseCaseError";

/* ============ QUERIES ============ */
export { listLeadsByType } from "./usecases/queries/listLeadsByType";
export { getLeadById } from "./usecases/queries/getLeadById";
export { listLeadsByTypeAndStatus } from "./usecases/queries/listLeadsByTypeAndStatus";
export { summarizeLeadsByType } from "./usecases/queries/summarizeLeadsByType";
export { validateLeadNumberAvailability } from "./usecases/queries/validateLeadNumberAvailability";

/* ============ COMMANDS ============ */
export { createLeadWithNewContact } from "./usecases/commands/createLeadWithNewContact";
export { createLeadWithExistingContact } from "./usecases/commands/createLeadWithExistingContact";
export { patchLead } from "./usecases/commands/patchLead";
export { changeLeadStatus } from "./usecases/commands/changeLeadStatus";
export { deleteLead } from "./usecases/commands/deleteLead";
