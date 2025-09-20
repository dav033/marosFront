import React from "react";
import Select from "@/presentation/atoms/Select";
import { formatContactOptions } from "@/presentation/utils/leadsOptions";

export type ContactLite = {
  id: number;
  name: string;
  companyName?: string;
  phone?: string;
  email?: string;
};

export type ContactSelectProps = {
  /** Lista de contactos en formato liviano */
  contacts: ReadonlyArray<ContactLite>;
  /** ID seleccionado (o undefined si no hay selección) */
  value?: number;
  /** Emite el ID (number) o undefined cuando se limpia */
  onChange: (contactId: number | undefined) => void;
  /** Placeholder del control */
  placeholder?: string;
  /** Activa el modo searchable del átomo Select */
  searchable?: boolean;
  /** Icono (Iconify name) mostrado a la izquierda */
  icon?: string;
  /** Deshabilitar input */
  disabled?: boolean;
  /** Clases extra */
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
