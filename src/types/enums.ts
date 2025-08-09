export enum InvoiceStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  NOT_EXECUTED = "NOT_EXECUTED",
}

export enum LeadStatus {
  NEW = "NEW",
  UNDETERMINED = "UNDETERMINED",
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  LOST = "LOST",
}

export enum LeadType {
  CONSTRUCTION = "CONSTRUCTION",
  PLUMBING = "PLUMBING",
  ROOFING = "ROOFING",
}

export enum ProjectStatus {
  NOT_EXECUTED = "NOT_EXECUTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  LOST = "LOST",
  POSTPONED = "POSTPONED",
}

export enum FormMode {
  CREATE = "CREATE",
  EDIT = "EDIT",
}

export enum ContactMode {
  NEW_CONTACT = "left",
  EXISTING_CONTACT = "right",
}

