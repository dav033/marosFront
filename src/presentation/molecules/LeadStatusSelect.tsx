import React from "react";
import { Select } from "@/presentation/atoms";
import { LeadStatus } from "@/features/leads/enums";
import { getLeadStatusOptions } from "@/presentation/utils/leadsOptions";

export type LeadStatusSelectProps = {
  value: LeadStatus | "";
  onChange: (value: LeadStatus | "") => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
};

export default function LeadStatusSelect({
  value,
  onChange,
  placeholder = "Select Status",
  className = "w-full",
  disabled = false,
  searchable = false,
}: LeadStatusSelectProps) {
  const options = getLeadStatusOptions();

  return (
    <Select
      options={options}
      value={value ?? ""}
      onChange={(v) => onChange(v as LeadStatus | "")}
      placeholder={placeholder}
      icon="material-symbols:flag"
      className={className}
      disabled={disabled}
      searchable={searchable}
    />
  );
}
