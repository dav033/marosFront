import classNames from "classnames";
import * as React from "react";

import type { Project } from "@/features/project/domain/models/Project"
import type { EvidenceItem } from "@/types/report";

import Divider from "../atoms/Divider";
import PdfButton from "../atoms/PdfButton";
import SectionTitle from "../atoms/SectionTitle";
import HeaderBlock from "./HeaderBlock";

export type RestorationFinalProps = {
  project: Project;

    finalEvaluation?: string;
  completionDate?: string;

    initialCompletedActivities?: string[];
  initialEvidences?: EvidenceItem[];

    logoUrl?: string | null;
  editableLogo?: boolean;
  onLogoChange?: (file: File | null, dataUrl?: string | null) => void;

    onExportPdf?: () => void | Promise<void>;
  className?: string;
};

export default function RestorationFinal({
  project,
  finalEvaluation,
  completionDate,
  initialCompletedActivities = [],
  initialEvidences = [],
  logoUrl = null,
  editableLogo = false,
  onLogoChange,
  onExportPdf,
  className,
}: RestorationFinalProps) {
  const [completed, setCompleted] = React.useState<string[]>(initialCompletedActivities);
  const [evidences, setEvidences] = React.useState<EvidenceItem[]>(initialEvidences);

  const evaluation = finalEvaluation ?? project.overview ?? "—";
  const endDate = completionDate ?? project.endDate ?? "—";

  const addCompleted = () => setCompleted((prev) => [...prev, ""]);
  const deleteCompleted = (idx: number) =>
    setCompleted((prev) => prev.filter((_, i) => i !== idx));
  const updateCompleted = (idx: number, value: string) =>
    setCompleted((prev) => prev.map((x, i) => (i === idx ? value : x)));

  const addEvidence = () =>
    setEvidences((prev) => [...prev, { description: "", imageFiles: [] }]);

  const deleteEvidence = (idx: number) =>
    setEvidences((prev) => prev.filter((_, i) => i !== idx));

  const updateEvidenceDesc = (idx: number, value: string) =>
    setEvidences((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, description: value } : e))
    );

  const updateEvidenceFiles = (idx: number, files: FileList | File[]) => {
    const list = Array.from(files ?? []);
    setEvidences((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, imageFiles: list } : e))
    );
  };

  return (
    <article className={classNames("space-y-6", className)}>
      {/* Cabecera (dominio real) */}
      <HeaderBlock
        project={project}
        title="Final Restoration Report"
        subtitle="Informe final de restauración"
        logoUrl={logoUrl}
        editableLogo={editableLogo}
        {...(onLogoChange ? { onLogoChange } : {})}
      />

      {/* Acciones */}
      <div className="flex items-center justify-end">
  <PdfButton {...(onExportPdf ? { onClick: onExportPdf } : {})}>Descargar PDF</PdfButton>
      </div>

      <Divider />

      {/* Evaluación y fecha de cierre */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionTitle title="Evaluación final" />
            <p className="text-sm text-gray-800 whitespace-pre-line">{evaluation}</p>
          </div>
          <div>
            <SectionTitle title="Fecha de finalización" />
            <div className="rounded-xl border border-gray-200 p-3 bg-white text-sm text-gray-900">
              {endDate}
            </div>
          </div>
        </div>
      </section>

      {/* Actividades completadas (lista simple como el original) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <SectionTitle title="Actividades completadas" />
        <div className="space-y-2 mt-2">
          {completed.length === 0 && (
            <p className="text-sm text-gray-500">Sin actividades.</p>
          )}
          {completed.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                className="border p-2 rounded w-full text-sm"
                value={item}
                onChange={(e) => updateCompleted(idx, e.target.value)}
                placeholder="Descripción de actividad"
              />
              <button
                type="button"
                onClick={() => deleteCompleted(idx)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCompleted}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Add Activity
          </button>
        </div>
      </section>

      {/* Evidencias (Descripción + múltiples imágenes) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <SectionTitle title="Evidence Images" />
        <div className="space-y-3 mt-2">
          {evidences.map((row, idx) => (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <input
                type="text"
                className="border p-2 rounded text-sm"
                placeholder="Descripción"
                value={row.description}
                onChange={(e) => updateEvidenceDesc(idx, e.target.value)}
              />
              <div className="lg:col-span-2 flex items-center gap-3">
                <input
                  type="file"
                  multiple
                  onChange={(e) => updateEvidenceFiles(idx, e.target.files!)}
                  className="block text-sm"
                />
                <button
                  type="button"
                  onClick={() => deleteEvidence(idx)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
              {/* Previsualización simple */}
              {row.imageFiles && row.imageFiles.length > 0 && (
                <div className="lg:col-span-3 overflow-x-auto rounded border p-2">
                  <div className="flex gap-2">
                    {row.imageFiles.map((f, i) => (
                      <div key={i} className="w-20 h-20 rounded border overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEvidence}
            className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Add Evidence
          </button>
        </div>
      </section>
    </article>
  );
}
