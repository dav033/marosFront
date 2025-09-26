export type { LeadsAppContext } from "./context";
export { makeLeadsAppContext } from "./context";
export { UseCaseError } from "./errors/UseCaseError";

/* ============ QUERIES ============ */
export { getLeadById } from "./usecases/queries/getLeadById";
export { listLeadsByType } from "./usecases/queries/listLeadsByType";
export { listLeadsByTypeAndStatus } from "./usecases/queries/listLeadsByTypeAndStatus";
export { summarizeLeadsByType } from "./usecases/queries/summarizeLeadsByType";
export { validateLeadNumberAvailability } from "./usecases/queries/validateLeadNumberAvailability";

/* ============ COMMANDS ============ */
export { changeLeadStatus } from "./usecases/commands/changeLeadStatus";
export { createLead } from "./usecases/commands/createLead";
export { deleteLead } from "./usecases/commands/deleteLead";
export { patchLead } from "./usecases/commands/patchLead";
