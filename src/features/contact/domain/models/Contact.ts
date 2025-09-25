export interface Contact {
  id: number;
  companyName: string;
  name: string;
  occupation?: string | undefined;
  product?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
  lastContact?: string | undefined;
}
