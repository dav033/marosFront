
import { useState } from "react";
import type { LeadType } from "@/features/leads/domain";
import type { LeadFormData } from "@/types";

export interface UseLeadFormOptions {
  leadType: LeadType;
  defaults?: Partial<LeadFormData>;
}

export function useLeadForm(options: UseLeadFormOptions) {
  const { defaults } = options;
  const base: LeadFormData = {
    leadName: "",
    leadNumber: "",
    location: "",
    projectTypeId: "" as unknown as number, 
    contactId: "" as unknown as number,
    companyName: "",
    customerName: "",
    contactName: "",
    occupation: "",
    product: "",
    phone: "",
    email: "",
    address: "",
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
