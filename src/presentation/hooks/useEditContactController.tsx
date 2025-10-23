import { useCallback, useEffect, useState } from "react";

import type { Contact } from "@/contact";
import type { ContactFormData } from "@/types";

export type UseEditContactControllerParams = {
  contact: Contact | null;
  onSubmit: (data: Contact) => Promise<void> | void;
};

export function useEditContactController({ contact, onSubmit }: UseEditContactControllerParams) {
  const [form, setForm] = useState<ContactFormData>(() => ({
    companyName: contact?.companyName ?? "",
    name: contact?.name ?? "",
    occupation: contact?.occupation ?? "",
    product: contact?.product ?? "",
    phone: contact?.phone ?? "",
    email: contact?.email ?? "",
    address: contact?.address ?? "",
    lastContact: contact?.lastContact ?? "",
  }));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      companyName: contact?.companyName ?? "",
      name: contact?.name ?? "",
      occupation: contact?.occupation ?? "",
      product: contact?.product ?? "",
      phone: contact?.phone ?? "",
      email: contact?.email ?? "",
      address: contact?.address ?? "",
    });
  }, [contact]);

  const setField = useCallback(
    <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const validate = (f: ContactFormData): string | null => {
    if (!f.companyName?.trim()) return "Company is required";
    if (!f.name?.trim()) return "Contact name is required";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return "Invalid email format";
    return null;
  };

  const submit = useCallback(async () => {
    const v = validate(form);
    if (v) {
      setError(v);
      return false;
    }
    try {
      if (!contact) {
        setError("No contact selected");
        return false;
      }
      setLoading(true);
      setError(null);
      const merged: Contact = {
        ...contact,
        ...form,
      };
      await onSubmit(merged);
      return true;
    } catch (e: unknown) {
      const msg = (e as Error | undefined)?.message ?? String(e ?? "Failed to update contact");
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [form, contact, onSubmit]);

  return { form, setField, submit, isLoading, error, setError };
}
