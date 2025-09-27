import React from "react";
import { DiProvider } from "@/di/DiProvider";
import ContactsIsland from "@/presentation/organisms/ContactsIsland";
import QueryProvider from "@/components/common/QueryProvider";

export default function ContactsIslandWithDi() {
  return (
    <QueryProvider>
      <DiProvider>
        <ContactsIsland />
      </DiProvider>
    </QueryProvider>
  );
}
