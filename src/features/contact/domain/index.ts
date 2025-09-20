// maros-app/src/features/contact/domain/index.ts
export type { Contacts } from "./models/Contact";
export type { ContactRepositoryPort } from "./ports/ContactRepositoryPort";
export type { ContactUniquenessPort } from "./ports/ContactUniquenessPort";

export {
  buildContactDraft,
} from "./services/buildContactDraft";
export {
  ensureContactDraftIntegrity,
} from "./services/ensureContactDraftIntegrity";
export {
  ensureContactIntegrity,
} from "./services/ensureContactIntegrity";
export {
  applyContactPatch,
} from "./services/applyContactPatch";
export {
  mapContactDraftToCreatePayload,
} from "./services/mapContactDraftToCreatePayload";
export {
  mapContactPatchToUpdatePayload,
} from "./services/mapContactToUpdatePayload";
export {
  mapContactFromDTO,
  mapContactsFromDTO,
} from "./services/contactReadMapper";