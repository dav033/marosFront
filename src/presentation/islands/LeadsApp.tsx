import React from 'react';

import { QueryProvider, TopLoader } from '@/components';
import { DiProvider, useContactsApp, useLeadsApp } from '@/di';
import { LeadsBoard, LoadingProvider, useContacts,useProjectTypesVM } from '@/presentation';
import { LeadType } from '@/types';

type Props = { leadType: LeadType };

function LeadsInner({ leadType }: { leadType: LeadType }) {
  const leadsCtx = useLeadsApp();
  useContactsApp(); // asegura el provider de contactos (si ya existía, no afecta)

  // 1) Cargar datos necesarios para los selects
  const { projectTypes } = useProjectTypesVM(leadsCtx);
  const { contacts } = useContacts();

  // 2) Pasarlos al board
  return (
    <LoadingProvider>
      <LeadsBoard
        leadType={leadType}
        title="Leads"
        projectTypes={projectTypes}
        contacts={contacts}
      />
      <div id="modal-root" />
    </LoadingProvider>
  );
}

export default function LeadsApp(props: Props) {
  return (
    <QueryProvider>
      <TopLoader />
      <DiProvider>
        <LeadsInner leadType={props.leadType} />
      </DiProvider>
    </QueryProvider>
  );
}
