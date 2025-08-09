import { useState, useCallback } from "react";
import type { Lead, LeadFormData, UseLeadFormOptions } from "src/types";
import { validateEmail } from "@utils/leadHelpers";

export const useLeadForm = ({
  initialData = {},
  onSubmit,
  onSuccess,
}: UseLeadFormOptions) => {
  const [form, setForm] = useState<LeadFormData>({
    leadName: "",
    customerName: "",
    contactName: "",
    phone: "",
    email: "",
    contactId: "",
    projectTypeId: "",
    location: "",
    status: "",
    startDate: "",
    ...initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof LeadFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setForm({
      leadName: "",
      customerName: "",
      contactName: "",
      phone: "",
      email: "",
      contactId: "",
      projectTypeId: "",
      location: "",
      status: "",
      startDate: "",
      ...initialData,
    });
  }, [initialData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEmail(form.email)) {
        setError("Please enter a valid email");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await onSubmit(form);
        resetForm();
        onSuccess?.();
      } catch (err) {
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
