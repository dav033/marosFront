// src/hooks/useLeadForm.ts

import { useState } from "react";
import type { LeadType } from "@/features/leads/domain";
import type { LeadFormData } from "@/types";

/**
 * Opciones del hook del formulario de Lead.
 * - leadType es requerido (lo usa el controlador y validaciones).
 * - defaults permite hidratar el formulario con valores iniciales.
 */
export interface UseLeadFormOptions {
  leadType: LeadType;
  defaults?: Partial<LeadFormData>;
}

/**
 * Hook controlado para el formulario de Lead.
 * Devuelve el objeto form y un handleChange genérico.
 */
export function useLeadForm(options: UseLeadFormOptions) {
  const { defaults } = options;

  // Estructura base del formulario; ajuste los campos si su LeadFormData varía.
  const base: LeadFormData = {
    // datos del lead
    leadName: "",
    leadNumber: "",
    location: "",
    projectTypeId: "" as unknown as number, // se castea a number en el submit
    // modo contacto existente
    contactId: "" as unknown as number,
    // contacto nuevo
    companyName: "",
    customerName: "",
    contactName: "",
    occupation: "",
    product: "",
    phone: "",
    email: "",
    address: "",
    // agregue aquí cualquier otro campo real de su LeadFormData
    ...(defaults ?? {}),
  } as LeadFormData;

  const [form, setForm] = useState<LeadFormData>(base);

  const handleChange = <K extends keyof LeadFormData>(
    field: K,
    value: LeadFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return { form, handleChange };
}

export default useLeadForm;
