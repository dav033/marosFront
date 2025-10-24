export const ContactMode = {
  NEW_CONTACT: 'NEW_CONTACT',
  EXISTING_CONTACT: 'EXISTING_CONTACT',
} as const;
export type ContactModeType = (typeof ContactMode)[keyof typeof ContactMode];

export const FormMode = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
} as const;
export type FormModeType = (typeof FormMode)[keyof typeof FormMode];
