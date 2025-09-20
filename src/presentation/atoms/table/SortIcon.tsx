// src/presentation/atoms/table/SortIcon.tsx
import React from "react";

export default function SortIcon({ dir }: { dir: "asc" | "desc" }) {
  return (
    <svg className="ml-1 h-4 w-4 fill-[#FE7743] flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      {dir === "asc" ? <path d="M7 14l5-5 5 5H7z" /> : <path d="M7 10l5 5 5-5H7z" />}
    </svg>
  );
}
