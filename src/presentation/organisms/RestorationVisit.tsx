import React from "react";


import { useProjectsVm } from "../hooks/useProjectsVm";
import ProjectPickerTable from "../molecules/ProjectPickerTable";
import RestorationVisitForm, { type RestorationVisitFormValues } from "../molecules/RestorationVisitForm";
import type { ProjectWithLeadView } from "../../features/project";

const initialValues: RestorationVisitFormValues = {
  projectNumber: "",
  projectName: "",
  projectLocation: "",
  clientName: "",
  contactName: "",
  email: "",
  phone: "",
  startDate: "",
  overview: "",
};

type Step = 1 | 2;

export default function RestorationVisit() {
  const [step, setStep] = React.useState<Step>(1);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [values, setValues] = React.useState<RestorationVisitFormValues>(initialValues);

  const { data, loading, error, loadWithLeads } = useProjectsVm();

  React.useEffect(() => {
    (async () => {
      const list = await loadWithLeads();
       
      console.log("[RestorationVisit] projects with leads:", list);
    })();
  }, [loadWithLeads]);

  const bind = React.useCallback(
    <K extends keyof RestorationVisitFormValues>(key: K) => ({
      name: key,
      value: values[key] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setValues((prev) => ({ ...prev, [key]: e.target.value })),
    }),
    [values]
  );

  const onNext = React.useCallback(() => {
    if (!selectedId) return;
    const p = (data as ProjectWithLeadView[]).find((it) => it.id === selectedId);
    if (!p) return;

    setValues({
      projectNumber: String(p.leadNumber ?? ""),
      projectName: p.projectName ?? "",
      projectLocation: p.location ?? p.leadName ?? "",
      clientName: p.customerName ?? "",
      contactName: p.contactName ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      startDate: p.startDate ?? "",
      overview: p.overview ?? "",
    });

    setStep(2);
  }, [selectedId, data]);

  return (
    <div className="space-y-4">
      {step === 1 && (
        <div className="bg-theme-dark text-theme-light border border-theme-gray-subtle rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Select a project</h2>
            <div className="text-sm">
              {loading
                ? "Loading…"
                : error
                ? <span className="text-red-400">{error}</span>
                : `${Array.isArray(data) ? data.length : 0} projects`}
            </div>
          </div>

          <ProjectPickerTable
            projects={(data as ProjectWithLeadView[]) ?? []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onNext}
              disabled={!selectedId || loading}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium",
                !selectedId || loading
                  ? "bg-theme-gray-alt/40 text-theme-light/40 cursor-not-allowed"
                  : "bg-theme-primary text-theme-dark hover:bg-theme-primary-alt",
              ].join(" ")}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-theme-dark text-theme-light border border-theme-gray-subtle rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Restoration Visit</h2>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-theme-gray-alt hover:bg-theme-gray"
            >
              Back
            </button>
          </div>

          <RestorationVisitForm values={values} bind={bind} />
        </div>
      )}
    </div>
  );
}
