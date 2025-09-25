// src/types/components/common.ts
/* eslint-disable simple-import-sort/imports */

import type React from "react";
import type { SearchFieldOption } from "../hooks";
import type { ContextMenuOption } from "../index";

export interface SearchBoxWithDropdownProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedField: string;
  onFieldChange: (field: string) => void;
  searchFields: SearchFieldOption[];
  onClearSearch: () => void;
  placeholder?: string | undefined;
  className?: string | undefined;
  hasActiveSearch?: boolean;
  resultCount?: number;
  totalCount?: number;
}

export interface CacheDiagnosticsProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===========================================
// FORM COMPONENTS
// ===========================================

export interface Option {
  value: string;
  label: string;
}

export interface GenericSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string | undefined;
  searchable?: boolean | undefined;
  icon?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

export interface GenericSwitchProps {
  leftLabel: string;
  rightLabel: string;
  value: "left" | "right";
  onChange: (value: "left" | "right") => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// ===========================================
// CONTEXT MENU
// ===========================================

export interface ContextMenuProps {
  options: ContextMenuOption[];
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

// ===========================================
// CACHE COMPONENTS
// ===========================================

export interface CacheInspectorInitProps {
  enabled?: boolean;
}

export interface CacheInitializerProps {
  enabled?: boolean;
  debug?: boolean;
  autoPreload?: boolean;
}

// ===========================================
// INPUT COMPONENTS
// ===========================================

export interface GenericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  icon?: string;
}
