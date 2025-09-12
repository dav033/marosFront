export type ContactDTO = {
  id?: number;
  companyName?: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  lastContact?: string | null;
};