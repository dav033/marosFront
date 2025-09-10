import { GenericButton } from "@components/common/GenericButton";
import Modal from "@components/common/modal/Modal";
import ModalBody from "@components/common/modal/ModalBody";
import ModalFooter from "@components/common/modal/ModalFooter";
import ModalHeader from "@components/common/modal/ModalHeader";
import { useEffect, useState } from "react";
import { OptimizedContactsService } from "src/services/OptimizedContactsService";
import type { ContactFormData } from "./ContactForm";
import type { EditContactModalProps } from "../../types/components/leads-contacts";
import ContactForm from "./ContactForm";

export default function EditContactModal({
  isOpen,
  onClose,
  contact,
}: EditContactModalProps) {
  const [form, setForm] = useState<ContactFormData>({
    companyName: "",
    name: "",
    occupation: "",
    product: "",
    phone: "",
    email: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (contact) {
      setForm({
        companyName: contact.companyName || "",
        name: contact.name || "",
        occupation: contact.occupation || "",
        product: contact.product || "",
        phone: contact.phone || "",
        email: contact.email || "",
        address: contact.address || "",
      });
    }
  }, [contact]);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contact) return;

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Pre-validate uniqueness with excludeId
      const validation = await OptimizedContactsService.validateContact({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        excludeId: contact.id,
      });
      if (!validation.nameAvailable || !validation.emailAvailable || !validation.phoneAvailable) {
        const fe: { name?: string; email?: string; phone?: string } = {};
        if (!validation.nameAvailable) fe.name = validation.nameReason || "Name already exists";
        if (!validation.emailAvailable) fe.email = validation.emailReason || "Email already exists";
        if (!validation.phoneAvailable) fe.phone = validation.phoneReason || "Phone already exists";
        setFieldErrors(fe);
        setIsLoading(false);
        return;
      }

      const updatedContact = await OptimizedContactsService.updateContact(
        contact.id,
        {
          companyName: form.companyName,
          name: form.name,
          occupation: form.occupation || undefined,
          product: form.product || undefined,
          phone: form.phone || undefined,
          email: form.email || undefined,
          address: form.address || undefined,
        }
      );

      console.log("✅ Contact updated successfully:", updatedContact);
      onClose(true); // shouldRefetch = true
    } catch (error) {
      console.error("❌ Error updating contact:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Unexpected error updating contact"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
  setFieldErrors({});
    onClose();
  };

  if (!contact) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader title="Edit Contact" onClose={handleClose} />

        <ModalBody>
          <ContactForm form={form} onChange={handleChange} error={error} />
          {Object.keys(fieldErrors).length > 0 && (
            <div className="mt-2 space-y-1">
              {fieldErrors.name && (
                <div className="text-red-600 text-sm">{fieldErrors.name}</div>
              )}
              {fieldErrors.email && (
                <div className="text-red-600 text-sm">{fieldErrors.email}</div>
              )}
              {fieldErrors.phone && (
                <div className="text-red-600 text-sm">{fieldErrors.phone}</div>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <GenericButton
            type="button"
            onClick={handleClose}
            className="bg-theme-primary-alt hover:bg-theme-primary-alt/80"
            disabled={isLoading}
          >
            Cancel
          </GenericButton>
          <GenericButton type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Contact"}
          </GenericButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}
