import React from "react";
import { DiProvider } from "@/di/DiProvider";
import ContactsIsland from "@/presentation/organisms/ContactsIsland";
import QueryProvider from "@/components/common/QueryProvider";
import TopLoader from "@/components/common/TopLoader";

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
