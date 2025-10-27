import { useCallback, useState } from "react";

import type { Contact } from "@/contact";
import { patchContact } from "@/contact";
import { useContactsApp } from "@/di";
import type { ContactFormData } from "@/types";

type EditContactForm = ContactFormData;

export function useEditContact(initial?: Contact | null) {
  const ctx = useContactsApp();
  const [form, setForm] = useState<EditContactForm>(() => ({
    companyName: initial?.companyName ?? "",
    name: initial?.name ?? "",
    occupation: initial?.occupation ?? "",
    product: initial?.product ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    address: initial?.address ?? "",
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const setField = useCallback(
    <K extends keyof EditContactForm>(key: K, value: EditContactForm[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
    },
    []
  );

  const submit = useCallback(async () => {
    if (!initial) return false;
    setIsLoading(true);
    setFormError(null);

    try {
      const patch = {
        companyName: form.companyName,
        name: form.name,
        occupation: form.occupation || undefined,
        product: form.product || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
      };

    await patchContact(ctx, initial.id, patch);
      return true;
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Unexpected error updating contact";
      setFormError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [form, initial, ctx]);

  return { form, setField, isLoading, formError, submit };
}
