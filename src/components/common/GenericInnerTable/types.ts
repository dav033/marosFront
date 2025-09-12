import type { ReactElement } from "react";
import type { Column } from "@/types";

export interface GenericInnerTableProps<T> {
  title: string;
  createButtonText: string;
  entityName: string; // "lead", "contact"
  entityNamePlural: string; // "leads", "contacts"
  
  // Data
  items: T[];
  isLoading: boolean;
  error: unknown;
  showSkeleton: boolean;
  
  // CRUD operations
  onAdd: (item: T) => void;
  onUpdate: (item: T) => void;
  onRemove: (id: number) => void;
  
  // Modals
  modals: {
    isCreateOpen: boolean;
    isEditOpen: boolean;
    editingItem?: T | null;
    [key: string]: unknown;
  };
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onOpenEdit: (item: T) => void;
  onCloseEdit: () => void;
  
  // Sections
  sections: Array<{
    title: string;
    data: T[];
    [key: string]: unknown;
  }>;
  
  // Table configuration
  columns: Column<T>[];
  
  // Components
  SectionComponent: React.ComponentType<{
    title: string;
    data: T[];
    columns: Column<T>[];
    onEditItem?: (item: T) => void;
    onDeleteItem?: (item: T) => void;
  }>;
  
  // Event handlers
  onDeleteItem: (item: T) => void;
  
  // Modal components as render functions
  renderCreateModal: () => ReactElement | null;
  renderEditModal: () => ReactElement | null;
  renderAdditionalModals?: () => ReactElement | null;
  
  // Additional buttons
  additionalButtons?: ReactElement[];
}
