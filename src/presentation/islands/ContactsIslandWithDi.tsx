import React from "react";

import { QueryProvider, TopLoader } from "@/components";
import { DiProvider } from "@/di";
import { ContactsIsland } from "@/presentation";

export default function ContactsIslandWithDi() {
  return (
    <QueryProvider>
      <TopLoader />
      <DiProvider>
        <ContactsIsland />
      </DiProvider>
    </QueryProvider>
  );
}
