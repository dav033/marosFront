/**
 * Skeleton para la tabla de contactos que coincide con el diseño real
 */

import type { ContactsTableSkeletonProps } from "@/types";

export function ContactsTableSkeleton({
  rows = 15,
}: ContactsTableSkeletonProps) {
  return (
    <div
      className="animate-pulse w-full max-w-full mx-auto p-6"
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-light)",
      }}
    >
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div
          className="h-10 rounded-lg w-40"
          style={{ backgroundColor: "var(--color-gray)" }}
        ></div>
        <div
          className="h-10 rounded w-full max-w-md"
          style={{ backgroundColor: "var(--color-gray)" }}
        ></div>
      </div>

      {/* Table container */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: "var(--color-gray-alt)" }}
      >
        {/* Table header */}
        <div
          className="px-6 py-4 border-b"
          style={{
            backgroundColor: "var(--color-gray)",
            borderBottomColor: "var(--color-gray-subtle)",
          }}
        >
          <div className="grid grid-cols-7 gap-4">
            <div
              className="h-4 rounded w-full"
              style={{ backgroundColor: "var(--color-gray-subtle)" }}
            ></div>
            <div
              className="h-4 rounded w-full"
              style={{ backgroundColor: "var(--color-gray-subtle)" }}
            ></div>
            <div
              className="h-4 rounded w-full"
              style={{ backgroundColor: "var(--color-gray-subtle)" }}
            ></div>
            <div
              className="h-4 rounded w-full"
              style={{ backgroundColor: "var(--color-gray-subtle)" }}
            ></div>
            <div
              className="h-4 rounded w-full"
              style={{ backgroundColor: "var(--color-gray-subtle)" }}
            ></div>
            <div
              className="h-4 rounded w-full"
              style={{ backgroundColor: "var(--color-gray-subtle)" }}
            ></div>
            <div
              className="h-4 rounded w-full"
              style={{ backgroundColor: "var(--color-gray-subtle)" }}
            ></div>
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="px-6 py-4 border-b last:border-b-0"
            style={{
              borderBottomColor: "var(--color-gray-subtle)",
              backgroundColor:
                index % 2 === 0 ? "var(--color-gray-alt)" : "var(--color-dark)",
            }}
          >
            <div className="grid grid-cols-7 gap-4 items-center">
              {/* Company - varying widths for realism */}
              <div
                className="h-4 rounded"
                style={{
                  backgroundColor: "var(--color-gray)",
                  width:
                    index % 3 === 0 ? "85%" : index % 3 === 1 ? "70%" : "95%",
                }}
              ></div>
              {/* Contact Name - varying widths */}
              <div
                className="h-4 rounded"
                style={{
                  backgroundColor: "var(--color-gray)",
                  width:
                    index % 4 === 0
                      ? "80%"
                      : index % 4 === 1
                        ? "90%"
                        : index % 4 === 2
                          ? "75%"
                          : "85%",
                }}
              ></div>
              {/* Occupation - some empty (—) */}
              <div
                className="h-4 rounded"
                style={{
                  backgroundColor: "var(--color-gray)",
                  width:
                    index % 3 === 0 ? "60%" : index % 3 === 1 ? "0%" : "70%",
                }}
              ></div>
              {/* Product - some empty (—) */}
              <div
                className="h-4 rounded"
                style={{
                  backgroundColor: "var(--color-gray)",
                  width:
                    index % 4 === 0
                      ? "0%"
                      : index % 4 === 1
                        ? "65%"
                        : index % 4 === 2
                          ? "0%"
                          : "75%",
                }}
              ></div>
              {/* Phone - always present */}
              <div
                className="h-4 rounded w-full"
                style={{ backgroundColor: "var(--color-gray)" }}
              ></div>
              {/* Email - varying presence */}
              <div
                className="h-4 rounded"
                style={{
                  backgroundColor: "var(--color-gray)",
                  width:
                    index % 5 === 0
                      ? "0%"
                      : index % 5 === 1
                        ? "90%"
                        : index % 5 === 2
                          ? "85%"
                          : index % 5 === 3
                            ? "0%"
                            : "95%",
                }}
              ></div>
              {/* Address/Last Contact - varying presence */}
              <div
                className="h-4 rounded"
                style={{
                  backgroundColor: "var(--color-gray)",
                  width:
                    index % 6 === 0
                      ? "80%"
                      : index % 6 === 1
                        ? "0%"
                        : index % 6 === 2
                          ? "90%"
                          : index % 6 === 3
                            ? "0%"
                            : index % 6 === 4
                              ? "75%"
                              : "85%",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between mt-6">
        <div
          className="h-4 rounded w-48"
          style={{ backgroundColor: "var(--color-gray)" }}
        ></div>
        <div className="flex space-x-2">
          <div
            className="h-8 rounded w-8"
            style={{ backgroundColor: "var(--color-gray)" }}
          ></div>
          <div
            className="h-8 rounded w-8"
            style={{ backgroundColor: "var(--color-gray)" }}
          ></div>
          <div
            className="h-8 rounded w-8"
            style={{ backgroundColor: "var(--color-gray)" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
