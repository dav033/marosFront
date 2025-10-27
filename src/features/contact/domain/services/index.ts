export type { ApplyContactPatchResult, ContactPatch } from "./applyContactPatch";
export { applyContactPatch } from "./applyContactPatch";
export type { ContactDraft } from "./buildContactDraft";
export { buildContactDraft } from "./buildContactDraft";
export {
	mergeApiUpdateFallback,
	mergeContact,
	mergeContactIntoCollection,
} from "./contactMergePolicy";
export {
	type ApiContactDTO,
	mapContactFromDTO,
	mapContactsFromDTO,
} from "./contactReadMapper";
export {
	assertUniqueContact,
	buildIdentityIndex,
	type ContactLike,
	type DuplicateGroup,
	type DuplicateMatch,
	findDuplicateGroups,
	isDuplicateContact,
	listPotentialDuplicates,
	type UniquenessOptions,
} from "./contactUniquenessPolicy";
export type { CreateContactRequestDTO, UpdateContactRequestDTO } from "./mapContactDTO";
export { buildCreateContactDTO, buildUpdateContactDTO } from "./mapContactDTO";

