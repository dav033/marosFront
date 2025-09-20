// Barrel de Application (Contact)

export type { ContactsAppContext } from "./context";

// QUERIES
export { listContacts } from "./usecases/queries/listContacts";
export { getContactById } from "./usecases/queries/getContactById";
export { validateContactUniqueness } from "./usecases/queries/validateContactUniqueness";

// COMMANDS
export { createContact } from "./usecases/commands/createContact";
export { patchContact } from "./usecases/commands/patchContact";
export { deleteContact } from "./usecases/commands/deleteContact";
