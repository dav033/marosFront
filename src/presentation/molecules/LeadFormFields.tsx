// src/presentation/molecules/LeadFormFields.tsx
import React from "react";
import { Input, Icon } from "@/presentation/atoms";
import { LeadStatus } from "@/features/leads/enums";
import { FormMode, ContactMode } from "src/types/enums";
// nuevas moléculas
import ProjectTypeSelect from "@/presentation/molecules/ProjectTypeSelect";
import ContactSelect from "@/presentation/molecules/ContactSelect";
import LeadStatusSelect from "@/presentation/molecules/LeadStatusSelect";

export type LeadFormFieldsProps = {
  form: {
    leadNumber: string;
    leadName: string;
    projectTypeId?: number;
    contactId?: number;
    location: string;
    status?: LeadStatus | "";
    startDate?: string; // YYYY-MM-DD
  };
  onChange: (
    field:
      | "leadNumber"
      | "leadName"
      | "projectTypeId"
      | "contactId"
      | "location"
      | "status"
      | "startDate",
    value: string | number | undefined
  ) => void;
  projectTypes: Array<{ id: number; name: string; color?: string }>;
  contacts?: Array<{
    id: number;
    name: string;
    companyName?: string;
    phone?: string;
    email?: string;
  }>;
  mode?: FormMode;
  contactMode?: ContactMode;
  showLeadNumber?: boolean;
};

const LeadFormFields: React.FC<LeadFormFieldsProps> = ({
  form,
  onChange,
  projectTypes,
  contacts = [],
  mode = FormMode.CREATE,
  contactMode,
  showLeadNumber,
}) => {
  const showLeadName = true;
  const effectiveShowLeadNumber =
    showLeadNumber !== undefined ? showLeadNumber : mode === FormMode.CREATE;
  const showStatus = mode === FormMode.EDIT;
  const showStartDate = mode === FormMode.EDIT;

  const showContactSelect =
    mode === FormMode.EDIT || contactMode === ContactMode.EXISTING_CONTACT;

  return (
    <>
      {effectiveShowLeadNumber && (
        <Input
          value={form.leadNumber}
          onChange={(e) => onChange("leadNumber", e.target.value)}
          placeholder="Lead Number (manual if no ClickUp)"
          leftAddon={<Icon name="material-symbols:pin" />}
          className="mb-3"
        />
      )}

      {showLeadName && (
        <Input
          value={form.leadName}
          onChange={(e) => onChange("leadName", e.target.value)}
          placeholder="Lead Name *"
          leftAddon={<Icon name="material-symbols:assignment" />}
          className="mb-3"
        />
      )}

      <ProjectTypeSelect
        projectTypes={projectTypes}
        value={form.projectTypeId}
        onChange={(val) => onChange("projectTypeId", val)}
        placeholder="Select Project Type *"
        className="w-full mb-3"
      />

      {showContactSelect && (
        <ContactSelect
          contacts={contacts}
          value={form.contactId}
          onChange={(val) => onChange("contactId", val)}
          placeholder="Select Contact *"
          className="w-full mb-3"
        />
      )}

      <Input
        value={form.location}
        onChange={(e) => onChange("location", e.target.value)}
        placeholder="Location"
        leftAddon={<Icon name="material-symbols:location-on" />}
        className="mb-3"
      />

      {showStatus && (
        <LeadStatusSelect
          value={form.status || ""}
          onChange={(val) => onChange("status", val)}
          placeholder="Select Status"
          className="w-full mb-3"
        />
      )}

      {showStartDate && (
        <Input
          type="date"
          value={form.startDate || ""}
          onChange={(e) => onChange("startDate", e.target.value)}
          placeholder="Start Date"
          leftAddon={<Icon name="material-symbols:calendar-today" />}
        />
      )}
    </>
  );
};

export default LeadFormFields;
