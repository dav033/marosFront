import React from "react";
import { DiProvider } from "@/di/DiProvider";
import ContactsIsland from "@/presentation/organisms/ContactsIsland";

export default function ContactsIslandWithDi() {
  return (
    <DiProvider>
      <ContactsIsland />
    </DiProvider>
  );
}
