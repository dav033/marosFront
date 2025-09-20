import { useState, useCallback } from "react";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import { patchContact } from "@/features/contact/application/usecases/commands/patchContact";
import type { ContactsAppContext } from "@/features/contact/application/context";
import { ContactHttpRepository } from "@/features/contact/infra/http/ContactHttpRepository";
import type { ContactFormData } from "@/types/components/form";

type EditContactForm = ContactFormData;

export function useEditContact(initial?: Contacts | null) {
  const [form, setForm] = useState<EditContactForm>(() => ({
    companyName: initial?.companyName ?? "",
    name: initial?.name ?? "",
    occupation: initial?.occupation ?? "",
    product: initial?.product ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    address: initial?.address ?? "",
    // ⛔️ lastContact eliminado
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
      const ctx: ContactsAppContext = {
        repos: {
          contact: new ContactHttpRepository(),
        },
      };

      // ⛔️ No enviamos lastContact
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
  }, [form, initial]);

  return { form, setField, isLoading, formError, submit };
}
