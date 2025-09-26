import React from "react";

export const LeadHeader: React.FC<{ title: string; total: number; right?: React.ReactNode }> = ({ title, total, right }) => (
  <header className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {total} lead{total !== 1 ? "s" : ""} total
      </p>
    </div>
    {right}
  </header>
);
