import React from "react";

import { Input } from "@/presentation"; 

export interface RestorationVisitFormValues {
  projectNumber: string;
  projectName: string;
  projectLocation: string;
  clientName: string;
  contactName: string;
  email?: string;
  phone?: string;
  startDate?: string; 
  overview: string;
}

type BindFn = <K extends keyof RestorationVisitFormValues>(
  key: K
) => {
  name: K;
  value: RestorationVisitFormValues[K] | "";
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

type Props = {
  values: RestorationVisitFormValues;
  bind: BindFn;
};

export default function RestorationVisitForm({ values: _values, bind }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="mb-2">
          <Input {...bind("projectNumber")} label="Project Number" />
        </div>
        <div className="mb-2">
          <Input {...bind("projectName")} label="Project Name" />
        </div>
        <div className="mb-2">
          <Input {...bind("projectLocation")} label="Project Location" />
        </div>
        <div className="mb-2">
          <Input {...bind("clientName")} label="Client Name" />
        </div>
        <div className="mb-2">
          <Input {...bind("contactName")} label="Contact Name" />
        </div>
      </div>

      <div>
        <div className="mb-2">
          <Input {...bind("email")} label="Email" />
        </div>
        <div className="mb-2">
          <Input {...bind("phone")} label="Phone" />
        </div>
        <div className="mb-2">
          <Input {...bind("startDate")} label="Start Date" />
        </div>
        <div className="mb-2">
          <Input {...bind("overview")} label="Overview" />
        </div>
      </div>
    </div>
  );
}
