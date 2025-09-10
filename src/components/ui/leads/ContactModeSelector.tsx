// ContactModeSelector.tsx
import React from "react";
import { GenericInput } from "@components/common/GenericInput";
import { GenericSwitch } from "@components/common/GenericSwitch";
import { ContactMode } from "src/types/enums";
import type { LeadFormData, ContactModeSelectorProps } from "@/types";

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("customerName", e.target.value)}
            placeholder="Customer Name *"
            icon="material-symbols:business-center"
            disabled={isLoading}
          />
          <GenericInput
            value={form.contactName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("contactName", e.target.value)}
            placeholder="Contact Name *"
            icon="material-symbols:person"
            disabled={isLoading}
          />
          <GenericInput
            value={form.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("phone", e.target.value)}
            placeholder="Phone"
            icon="material-symbols:settings-phone-sharp"
            disabled={isLoading}
          />
          <GenericInput
            value={form.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("email", e.target.value)}
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
