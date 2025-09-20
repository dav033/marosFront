import { useCallback, useState } from "react";
import type { ContactFormData } from "@/types";

const EMPTY: ContactFormData = {
  companyName: "",
  name: "",
  occupation: "",
  product: "",
  phone: "",
  email: "",
  address: "",
};

export type UseCreateContactControllerParams = {
  onSubmit: (data: ContactFormData) => Promise<void> | void;
};

export function useCreateContactController({ onSubmit }: UseCreateContactControllerParams) {
  const [form, setForm] = useState<ContactFormData>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const setField = useCallback(
    <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const validate = (f: ContactFormData): string | null => {
    if (!f.companyName?.trim()) return "Company is required";
    if (!f.name?.trim()) return "Contact name is required";
    // opcional: validar email
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return "Invalid email format";
    return null;
    // (si lastContact es date opcional, no bloqueamos)
  };

  const submit = useCallback(async () => {
    const v = validate(form);
    if (v) {
      setError(v);
      return false;
    }
    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        ...form,
        companyName: form.companyName.trim(),
        name: form.name.trim(),
      });
      setForm(EMPTY);
      return true;
    } catch (e: any) {
      setError(e?.message ?? "Failed to create contact");
      return false;
    } finally {
      setLoading(false);
    }
  }, [form, onSubmit]);

  return { form, setField, submit, isLoading, error, setError };
}
