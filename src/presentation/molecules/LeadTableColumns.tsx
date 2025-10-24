import React from 'react';

import type { Lead } from '@/leads';
import { ProjectTypeBadge, StatusBadge } from '@/presentation';
import type { Column } from '@/types';
import { formatDate } from '@/utils';

export const leadTableColumns: Column<Lead>[] = [
  {
    key: 'name',
    id: 'name',
    header: 'Name',
    label: 'Name',
    accessor: (lead) => lead.name,
    type: 'text',
  },
  {
    key: 'leadNumber',
    id: 'leadNumber',
    header: 'Lead #',
    label: 'Lead #',
    accessor: (lead) => lead.leadNumber,
    type: 'text',
  },
  {
    key: 'startDate',
    id: 'startDate',
    header: 'Start Date',
    label: 'Start Date',
    accessor: (lead) => lead.startDate,
    type: 'text',
    cellRenderer: (v) => formatDate(String(v), { format: 'medium' }),
  },
  {
    key: 'location',
    id: 'location',
    header: 'Location',
    label: 'Location',
    accessor: (lead) => lead.location ?? '—',
    type: 'text',
  },
  {
    key: 'status',
    id: 'status',
    header: 'Status',
    label: 'Status',
    accessor: (lead) => lead.status ?? '',
    type: 'text',
    cellRenderer: (_value, lead) => {
      if (!lead.status) return <span>—</span>;

      return (
        <div className="flex justify-center">
          <StatusBadge status={lead.status} size="md" />
        </div>
      );
    },
  },
  {
    key: 'projectType',
    id: 'projectType',
    header: 'Project Type',
    label: 'Project Type',
    accessor: (lead) => lead.projectType?.name ?? 'N/A',
    type: 'text',
    cellRenderer: (_value, lead) => (
      <ProjectTypeBadge projectType={lead.projectType ?? null} />
    ),
  },
  {
    key: 'contact',
    id: 'contact',
    header: 'Contact Name',
    label: 'Contact Name',
    accessor: (lead) => lead.contact?.name ?? '—',
    type: 'text',
  },
];
