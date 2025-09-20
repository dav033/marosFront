// src/presentation/hooks/useLeadForm.ts
import { useState, useCallback } from "react";
import { LeadType } from "@/features/leads/enums";
import { validateEmail } from "@utils/leadHelpers";
import type { LeadFormData, UseLeadFormOptions } from "@/types/components";

export const useLeadForm = ({
  initialData = {},
  onSubmit,
  onSuccess,
}: UseLeadFormOptions) => {
  const makeInitial = (d: Partial<LeadFormData>): LeadFormData => ({
    // Requeridos con fallback seguro
    name: d.name ?? d.leadName ?? "",
    leadType: d.leadType ?? LeadType.CONSTRUCTION,
    startDate: d.startDate ?? "",
    status: d.status ?? null,

    // Opcionales con normalización útil para el form
    leadNumber: d.leadNumber ?? "",
    leadName: d.leadName ?? "",
    location: d.location ?? "",
    projectTypeId: d.projectTypeId ?? 0,
    contactId: d.contactId ?? 0,

    companyName: d.companyName ?? "",
    contactName: d.contactName ?? d.customerName ?? "",
    customerName: d.customerName ?? "",
    occupation: d.occupation ?? "",
    product: d.product ?? "",
    phone: d.phone ?? "",
    email: d.email ?? "",
    address: d.address ?? "",
  });

  const [form, setForm] = useState<LeadFormData>(() => makeInitial(initialData));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Acepta string | number y normaliza numéricos / nulos
  const handleChange = useCallback(
    (field: keyof LeadFormData, value: string | number) => {
      setForm((prev) => {
        const next: LeadFormData = { ...prev };

        if (field === "projectTypeId" || field === "contactId") {
          const num =
            value === "" || value === undefined || value === null
              ? undefined
              : Number(value);
          (next as any)[field] = num;
        } else if (field === "status") {
          // "" ⇒ null; cualquier otro valor se asigna tal cual
          (next as any)[field] = (value as string) === "" ? null : (value as any);
        } else {
          (next as any)[field] = String(value ?? "");
        }

        // Si el usuario completa leadName y name está vacío, sincroniza por conveniencia
        if (field === "leadName" && !next.name) {
          next.name = String(value ?? "");
        }

        return next;
      });
    },
    []
  );

  const resetForm = useCallback(() => {
    setForm(makeInitial(initialData));
    setError(null);
  }, [initialData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEmail(form.email ?? "")) {
        setError("Please enter a valid email");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await onSubmit(form);
        resetForm();
        onSuccess?.(form);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Form submission error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [form, onSubmit, onSuccess, resetForm]
  );

  return {
    form,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    resetForm,
    setError,
    setForm,
  };
};
