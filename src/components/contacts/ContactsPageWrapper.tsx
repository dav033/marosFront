import React from "react";
import { ContactsProvider } from "../../contexts/ContactsContext";
import InteractiveTable from "./InteractiveTable";

const ContactsPageWrapper: React.FC = () => {
  return (
    <ContactsProvider>
      <InteractiveTable />
    </ContactsProvider>
  );
};

export default ContactsPageWrapper;
