// Barrel de Application (Contact)

export type { ContactsAppContext } from "./context";

// QUERIES
export { getContactById } from "./usecases/queries/getContactById";
export { listContacts } from "./usecases/queries/listContacts";
export { validateContactUniqueness } from "./usecases/queries/validateContactUniqueness";

// COMMANDS
export { createContact } from "./usecases/commands/createContact";
export { deleteContact } from "./usecases/commands/deleteContact";
export { patchContact } from "./usecases/commands/patchContact";

// Preferred aliases (singular / standard verbs)
export { createContact as create } from "./usecases/commands/createContact";
export { deleteContact as delete } from "./usecases/commands/deleteContact";
export { patchContact as update } from "./usecases/commands/patchContact";
export { getContactById as findById } from "./usecases/queries/getContactById";
export { listContacts as findAll } from "./usecases/queries/listContacts";
