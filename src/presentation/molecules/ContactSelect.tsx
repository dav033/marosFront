import React from "react";

import Select from "@/presentation/atoms/Select";
import { formatContactOptions } from "@/presentation/utils/leadsOptions";

export type ContactLite = {
  id: number;
  name: string;
  companyName?: string;
  phone?: string | undefined;
  email?: string | undefined;
};

export type ContactSelectProps = {
    contacts: ReadonlyArray<ContactLite>;
    value: number | "" | undefined;
    onChange: (contactId: number | undefined) => void;
    placeholder?: string;
    searchable?: boolean;
    icon?: string;
    disabled?: boolean;
    className?: string;
};

const ContactSelect: React.FC<ContactSelectProps> = ({
  contacts,
  value,
  onChange,
  placeholder = "Select Contact *",
  searchable = true,
  icon = "material-symbols:person",
  disabled = false,
  className = "",
}) => {
  const options = formatContactOptions(contacts);

  return (
    <Select
      searchable={searchable}
      options={options}
      value={value ?? ""}
      onChange={(val) => onChange(val ? Number(val) : undefined)}
      placeholder={placeholder}
      icon={icon}
      disabled={disabled}
      className={className}
    />
  );
};

export default ContactSelect;
