// src/presentation/molecules/leads/EmptyState.tsx
import React from "react";
import Button from "../atoms/Button";

export const EmptyState: React.FC<{
  title: string;
  onCreate: () => void;
  onCreateLocal: () => void;
}> = ({ title, onCreate, onCreateLocal }) => (
  <div className="text-center py-12">
    <div className="text-gray-500 dark:text-gray-400 mb-4">No {title.toLowerCase()} found</div>
    <Button onClick={onCreate}>Create your first {title.toLowerCase().slice(0, -1)}</Button>
    <div className="mt-2">
      <Button onClick={onCreateLocal}>Create lead locally (don’t sync to ClickUp)</Button>
    </div>
  </div>
);
