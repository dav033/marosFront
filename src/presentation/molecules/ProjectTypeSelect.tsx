import React from "react";

import { Select } from "@/presentation/atoms";
import { formatProjectTypeOptions } from "@/presentation/utils/leadsOptions";

export type ProjectTypeLite = { id: number; name: string; color?: string };

export type ProjectTypeSelectProps = {
  projectTypes: ReadonlyArray<ProjectTypeLite>;
  value: number | "" | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
};

export default function ProjectTypeSelect({
  projectTypes,
  value,
  onChange,
  placeholder = "Select Project Type *",
  className = "w-full",
  disabled = false,
  searchable = true,
}: ProjectTypeSelectProps) {
  const options = formatProjectTypeOptions(projectTypes);

  return (
    <Select
      searchable={searchable}
      options={options}
      value={value ?? ""}
      onChange={(val) => onChange(val ? Number(val) : undefined)}
      placeholder={placeholder}
      icon="material-symbols:design-services"
      className={className}
      disabled={disabled}
    />
  );
}
