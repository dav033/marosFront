// ContactModeSelector.tsx
import React from "react";
import { GenericInput } from "@components/common/GenericInput";
import { GenericSwitch } from "@components/common/GenericSwitch";
import { ContactMode } from "src/types/enums";
import type { LeadFormData } from "src/types/domain"; // asegure la ruta correcta

type SelectorFields = "customerName" | "contactName" | "phone" | "email";

interface ContactModeSelectorProps {
  contactMode: ContactMode;
  onContactModeChange: (mode: ContactMode) => void;
  form: Partial<Pick<LeadFormData, SelectorFields>>;
  onChange: (field: SelectorFields, value: string) => void; // ← solo las 4 claves relevantes
  isLoading: boolean;
}

const ContactModeSelector = ({
  contactMode,
  onContactModeChange,
  form,
  onChange,
  isLoading,
}: ContactModeSelectorProps) => {
  const handleModeChange = (value: "left" | "right") => {
    const mode =
      value === "left" ? ContactMode.NEW_CONTACT : ContactMode.EXISTING_CONTACT;
    onContactModeChange(mode);
  };

  return (
    <>
      <div className="flex justify-center mb-4">
        <GenericSwitch
          leftLabel="New Contact"
          rightLabel="Existing Contact"
          value={contactMode}
          onChange={handleModeChange}
          disabled={isLoading}
          size="md"
          className="w-80"
        />
      </div>

      {contactMode === ContactMode.NEW_CONTACT && (
        <>
          <GenericInput
            value={form.customerName}
            onChange={(e) => onChange("customerName", e.target.value)}
            placeholder="Customer Name *"
            icon="material-symbols:business-center"
            disabled={isLoading}
          />
          <GenericInput
            value={form.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
            placeholder="Contact Name *"
            icon="material-symbols:person"
            disabled={isLoading}
          />
          <GenericInput
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Phone"
            icon="material-symbols:settings-phone-sharp"
            disabled={isLoading}
          />
          <GenericInput
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Email"
            icon="material-symbols:attach-email-outline"
            disabled={isLoading}
          />
        </>
      )}
    </>
  );
};

export default ContactModeSelector;
