import React from 'react';
import { DiProvider, useContactsApp, useLeadsApp } from '@/di/DiProvider';
import { LeadType } from '@/features/leads/enums';
import QueryProvider from '@/components/common/QueryProvider';
import TopLoader from '@/components/common/TopLoader';
import { LoadingProvider } from '../context/loading/LoadingContext';
import LeadsBoard from '../organisms/LeadsBoard';

type Props = {
  leadType: LeadType;
};

function LeadsInner({ leadType }: { leadType: LeadType }) {
  const leadsCtx = useLeadsApp();
  const contactsCtx = useContactsApp();

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
