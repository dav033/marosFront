import React from "react";
export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
    <div className="text-red-600 dark:text-red-400">Error loading leads: {message}</div>
  </div>
);
