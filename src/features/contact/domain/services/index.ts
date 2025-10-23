export { buildCreateContactDTO, buildUpdateContactDTO } from "./mapContactDTO";
export type { CreateContactRequestDTO, UpdateContactRequestDTO } from "./mapContactDTO";

export { applyContactPatch } from "./applyContactPatch";
export type { ApplyContactPatchResult, ContactPatch } from "./applyContactPatch";
export { buildContactDraft } from "./buildContactDraft";
export type { ContactDraft } from "./buildContactDraft";

export {
	mergeApiUpdateFallback,
	mergeContact,
	mergeContactIntoCollection,
} from "./contactMergePolicy";

export {
	assertUniqueContact,
	buildIdentityIndex,
	findDuplicateGroups,
	isDuplicateContact,
	listPotentialDuplicates,
	type ContactLike,
	type DuplicateGroup,
	type DuplicateMatch,
	type UniquenessOptions,
} from "./contactUniquenessPolicy";

export {
	mapContactFromDTO,
	mapContactsFromDTO,
	type ApiContactDTO,
} from "./contactReadMapper";

// Re-export other service-level modules here as needed to keep a single barrel.