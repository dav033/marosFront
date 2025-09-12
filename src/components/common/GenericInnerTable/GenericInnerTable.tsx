import React, { useEffect, useState } from "react";
import { GenericButton } from "@components/common/GenericButton";
import type { GenericInnerTableProps } from "./types";

export default function GenericInnerTable<T extends { id?: number }>({
  title,
  createButtonText,
  entityName,
  entityNamePlural,
  items,
  isLoading,
  error,
  showSkeleton,
  onAdd,
  onUpdate,
  onRemove,
  modals,
  onOpenCreate,
  onCloseCreate,
  onOpenEdit,
  onCloseEdit,
  sections,
  columns,
  SectionComponent,
  onDeleteItem,
  renderCreateModal,
  renderEditModal,
  renderAdditionalModals,
  additionalButtons = [],
}: GenericInnerTableProps<T>) {
  // Estado para manejar hidratación
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <div className="text-red-600 dark:text-red-400">
          Error loading {entityNamePlural}: {
            typeof error === 'object' && error !== null && 'message' in error 
              ? (error as { message?: string }).message 
              : String(error)
          }
        </div>
      </div>
    );
  }

  // Mostrar skeleton o loading mientras no esté hidratado o cargando
  if (!isClient || showSkeleton || isLoading) return null;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {items.length} {entityName}{items.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GenericButton
            className="text-sm"
            onClick={onOpenCreate}
            disabled={isLoading}
          >
            {createButtonText}
          </GenericButton>
          {additionalButtons.map((button, index) => (
            <React.Fragment key={index}>{button}</React.Fragment>
          ))}
        </div>
      </header>

      {/* Modals */}
      {renderCreateModal()}
      {renderEditModal()}
      {renderAdditionalModals?.()}

      {/* Sections */}
      <div className="space-y-6">
        {sections.map(({ title: secTitle, data, ...sectionProps }) => (
          <SectionComponent
            key={secTitle}
            title={secTitle}
            data={data}
            columns={columns}
            onEditItem={onOpenEdit}
            onDeleteItem={onDeleteItem}
            {...sectionProps}
          />
        ))}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            No {entityNamePlural.toLowerCase()} found
          </div>
          <GenericButton onClick={onOpenCreate}>
            Create your first {entityName.toLowerCase()}
          </GenericButton>
        </div>
      )}
    </div>
  );
}
