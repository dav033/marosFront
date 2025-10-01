// Shim de compatibilidad: reexporta desde Domain para eliminar duplicidad.
export {
  buildCreateContactDTO,
  buildUpdateContactDTO,
  type CreateContactRequestDTO,
  type UpdateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactDTO";
