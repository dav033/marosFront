import React from 'react';

import { QueryProvider, TopLoader } from '@/components';
import { DiProvider, useContactsApp, useLeadsApp } from '@/di';
import { LeadsBoard,LoadingProvider } from '@/presentation';
import { LeadType } from '@/types';

type Props = {
  leadType: LeadType;
};

function LeadsInner({ leadType }: { leadType: LeadType }) {
  const _leadsCtx = useLeadsApp();
  const _contactsCtx = useContactsApp();

  return (
    <LoadingProvider>
      <LeadsBoard leadType={leadType} title='e' />
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
