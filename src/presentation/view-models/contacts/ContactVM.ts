import type { Contact } from "../../../domain/entities/Contact";

export type ContactVM = {
  id?: number;
  company: string;
  name: string;
  email: string;
  phone: string;
  lastContactLabel: string;
};

export function toContactVM(c: Contact): ContactVM {
  return {
    id: c.id,
    company: c.companyName ?? "",
    name: c.name,
    email: c.email ?? "",
    phone: c.phone ?? "",
    lastContactLabel: c.lastContact ? new Date(c.lastContact).toLocaleString() : ""
  };
}