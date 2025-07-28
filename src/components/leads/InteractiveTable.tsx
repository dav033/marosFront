// src/components/interactive/InteractiveTable.tsx
import React from "react";
import { useFetch } from "src/hooks/UseFetchResult";
import { LeadsService } from "src/services/LeadsService";
import type { Leads } from "src/types/types";
import Table from "../table/Table";
import type { Column } from "../../types/types";
import { LeadType } from "src/types/enums";

export default function InteractiveTable() {
  const type = LeadType.CONSTRUCTION;
  const {
    data: leads,
    loading,
    error,
    refetch,
  } = useFetch<Leads[], [LeadType]>(LeadsService.getLeadsByType, [type]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns: Column<Leads>[] = [
    {
      id: "name",
      header: "Name",
      accessor: (lead) => lead.name,
      type: "string",
    },
    {
      id: "leadNumber",
      header: "# Lead",
      // Ahora se devuelve tal cual el string desde la base
      accessor: (lead) => lead.leadNumber,
      type: "string",
    },
    {
      id: "startDate",
      header: "Start Date",
      accessor: (lead) => lead.startDate,
      type: "string",
    },
    {
      id: "location",
      header: "Location",
      accessor: (lead) => lead.location ?? "—",
      type: "string",
    },
    {
      id: "status",
      header: "Status",
      accessor: (lead) => lead.status,
      type: "string",
    },
    {
      id: "projectType",
      header: "Project Type",
      accessor: (lead) => lead.projectType.name,
      type: "string",
    },
    {
      id: "contact",
      header: "Contact Name",
      accessor: (lead) => lead.contact.name,
      type: "string",
    },
    // {
    //   id: "email",
    //   header: "Contact Email",
    //   accessor: (lead) => lead.contact.email ?? "—",
    //   type: "string",
    // },
  ];

  return (
    <div className="space-y-4">
      <button
        onClick={refetch}
        className="px-4 py-2 bg-[#FE7743] text-[#EFEEEA] rounded hover:bg-[#FE7743]/90"
      >
        Refrescar datos
      </button>

      <Table columns={columns} data={leads ?? []} />
    </div>
  );
}
