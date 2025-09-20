// src/types/enums.ts
export enum FormMode {
  CREATE = "CREATE",
  EDIT = "EDIT",
}

/**
 * Enum canónico para ContactMode en TODA la app.
 * Los valores "left" | "right" facilitan el bridge con GenericSwitch.
 */
export enum ContactMode {
  NEW_CONTACT = "left",
  EXISTING_CONTACT = "right",
}
