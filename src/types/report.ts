import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { Project } from "@/features/project/domain/models/Project";

export type ActivityStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "PENDING"
  | "OBSERVED"
  | "ON_HOLD"
  | "CANCELLED";

export type CompletedActivity = {
  activity: string;
  status?: ActivityStatus;
  date?: string;   
  notes?: string;
};

export type ReportImage = {
  src: string;      
  caption?: string;
  alt?: string;
};

export type EvidenceItem = {
  description: string;
  imageFiles?: File[];    
  imageIds?: Array<string | number | { id: string | number }>; 
};

export type ReportData = {
  project: Project;
  lead: Lead;
  contact: Contact;
  completedActivities?: CompletedActivity[];
  observations?: string[];
  photos?: ReportImage[];
};


function s(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  const t = typeof v;
  if (t === "string") return v as string;
  if (t === "number" || t === "boolean") return String(v);
  return fallback;
}

function joinNonEmpty(parts: Array<string | undefined>, sep = " — "): string {
  return parts.filter((p) => !!p && p.trim().length > 0).join(sep);
}


export function selectLead(p?: Project | null): Lead | undefined {
  return p?.lead;
}

export function selectContact(p?: Project | null): Contact | undefined {
  return p?.lead?.contact;
}

export function selectLocationFromLead(p?: Project | null): string | undefined {
  return p?.lead?.location || undefined;
}

export function getProjectName(p?: Project | null): string {
  return s(p?.projectName);
}
export function getProjectOverview(p?: Project | null): string {
  return s(p?.overview);
}
export function getProjectStartDate(p?: Project | null): string {
  return s(p?.startDate);
}
export function getProjectEndDate(p?: Project | null): string {
  return s(p?.endDate);
}
export function getProjectPeriod(p?: Project | null): string {
  return joinNonEmpty([getProjectStartDate(p), getProjectEndDate(p)]);
}
export function getLeadNumber(p?: Project | null): string {
  return s(p?.lead?.leadNumber);
}
export function getLeadLocation(p?: Project | null): string {
  return s(p?.lead?.location);
}
export function getClientCompany(p?: Project | null): string {
  return s(p?.lead?.contact?.companyName);
}
export function getContactName(p?: Project | null): string {
  return s(p?.lead?.contact?.name);
}
export function getContactEmail(p?: Project | null): string {
  return s(p?.lead?.contact?.email);
}
export function getContactPhone(p?: Project | null): string {
  return s(p?.lead?.contact?.phone);
}
export function getContactAddress(p?: Project | null): string {
  return s(p?.lead?.contact?.address);
}


export type HeaderView = {
  projectName: string;
  overview: string;
  period: string;        
  location: string;      
  clientCompany: string; 
  contactName: string;
  email: string;
  phone: string;
  address: string;
  leadNumber: string;
};

export function getHeaderView(p?: Project | null): HeaderView {
  return {
    projectName: getProjectName(p),
    overview: getProjectOverview(p),
    period: getProjectPeriod(p),
    location: getLeadLocation(p),
    clientCompany: getClientCompany(p),
    contactName: getContactName(p),
    email: getContactEmail(p),
    phone: getContactPhone(p),
    address: getContactAddress(p),
    leadNumber: getLeadNumber(p),
  };
}


export function requireProject(p?: Project | null): asserts p is Project {
  if (!p) throw new Error("report.ts: Project es undefined/null en runtime.");
}
export function requireLead(p?: Project | null): asserts p is Project {
  if (!p?.lead) throw new Error("report.ts: Project.lead es undefined/null en runtime.");
}
export function requireContact(p?: Project | null): asserts p is Project {
  if (!p?.lead?.contact) throw new Error("report.ts: Project.lead.contact es undefined/null en runtime.");
}
