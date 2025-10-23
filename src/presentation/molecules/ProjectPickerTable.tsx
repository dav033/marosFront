import React from "react";

import type { ProjectWithLeadView } from "@/project";

type Props = {
  projects: ProjectWithLeadView[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function ProjectPickerTable({ projects, selectedId, onSelect }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-md bg-theme-dark text-theme-light border border-theme-gray-subtle">
      <table className="w-full table-fixed custom-table text-theme-light">
        <thead className="bg-theme-gray-darker">
          <tr className="border-b border-theme-gray-subtle">
            <th className="px-3 py-3 w-10" />
            <th className="px-3 py-3 text-left text-sm font-medium uppercase tracking-wider">Lead #</th>
            <th className="px-3 py-3 text-left text-sm font-medium uppercase tracking-wider">Project name</th>
            <th className="px-3 py-3 text-left text-sm font-medium uppercase tracking-wider">Location</th>
            <th className="px-3 py-3 text-left text-sm font-medium uppercase tracking-wider">Contact name</th>
            <th className="px-3 py-3 text-left text-sm font-medium uppercase tracking-wider">Client name</th>
          </tr>
        </thead>
        <tbody className="bg-theme-dark">
          {projects.map((p) => {
            const isSelected = selectedId === p.id;
            return (
              <tr
                key={p.id}
                className={[
                  "cursor-pointer hover:bg-theme-primary/10",
                  isSelected ? "bg-theme-primary/15 outline outline-1 outline-theme-primary" : "bg-theme-dark",
                ].join(" ")}
                onClick={() => onSelect(p.id)}
              >
                <td className="px-3 py-3 align-middle">
                  <input
                    type="radio"
                    name="projectPicker"
                    aria-label={`select project ${p.id}`}
                    checked={isSelected}
                    onChange={() => onSelect(p.id)}
                  />
                </td>
                <td className="px-3 py-3 align-middle">{p.leadNumber ?? ""}</td>
                <td className="px-3 py-3 align-middle">{p.projectName}</td>
                <td className="px-3 py-3 align-middle">{p.location ?? p.leadName ?? ""}</td>
                <td className="px-3 py-3 align-middle">{p.contactName ?? ""}</td>
                <td className="px-3 py-3 align-middle">{p.customerName ?? ""}</td>
              </tr>
            );
          })}
          {projects.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-6 text-center text-sm text-theme-light border-t border-theme-gray-subtle">
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
