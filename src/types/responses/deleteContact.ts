// src/types/responses/deleteContact.ts

export interface DeleteContactResponse {
  success: boolean;
  message: string;
  deletedId?: string;
}
