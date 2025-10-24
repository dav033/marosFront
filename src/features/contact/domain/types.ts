

export type ContactId = number;

export type Contact = Readonly<{
  id: ContactId;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
}>;

export type CreateContactRequestDTO = Readonly<{
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
}>;


export type ApiContactDTO = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
};
