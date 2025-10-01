import { useState } from "react";
import type { LeadFormData } from "@/types/components/form";
import { LeadStatus, LeadType } from "@/features/leads/enums";

export interface UseLeadFormOptions {
  initialData?: Partial<LeadFormData>;
}

export function useLeadForm(options: UseLeadFormOptions) {
  const { initialData } = options;

    const base: LeadFormData = {
    name: "",
    startDate: "",
    status: LeadStatus.NEW,
    leadType: LeadType.CONSTRUCTION,

        leadNumber: "",
    leadName: "",
    location: "",
    projectTypeId: undefined,
    contactId: undefined,
    companyName: "",
    customerName: "",
    contactName: "",
    occupation: "",
    product: "",
    phone: "",
    email: "",
    address: "",

    ...(initialData ?? {}),
  };

  const [form, setForm] = useState<LeadFormData>(base);

  const handleChange = <K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return { form, handleChange, setForm };
}

export default useLeadForm;
