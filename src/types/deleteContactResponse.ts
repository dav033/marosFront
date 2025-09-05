export type DeleteContactResponse =
  | { deleted?: boolean; success?: boolean }
  | boolean
  | undefined;
