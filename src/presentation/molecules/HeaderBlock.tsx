import * as React from "react";

import type { Project } from "@/project";

type HeaderBlockProps = {
  project?: Project;
  title?: string;
  subtitle?: string;
  logoUrl?: string | null;
  editableLogo?: boolean;
  onLogoChange?: (file: File | null, dataUrl?: string | null) => void;
};

export default function HeaderBlock({ project: _project, title, subtitle, logoUrl, editableLogo: _editableLogo, onLogoChange: _onLogoChange }: HeaderBlockProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div>
        {logoUrl ? <img src={logoUrl} alt="logo" className="h-10" /> : null}
      </div>
    </header>
  );
}
