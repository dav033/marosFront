
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import type { Contact } from "../models/Contact";
import {
  areContactsPotentialDuplicates,
  type DuplicateCheckOptions,
  makeContactIdentityKey,
  normalizeCompany,
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from "./contactIdentityPolicy";


export type ContactLike = Readonly<{
  name?: string | undefined;
  companyName?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
}>;

export type UniquenessOptions = DuplicateCheckOptions;

export type DuplicateMatch = Readonly<{
  key: string; 
  match: Contact; 
}>;

export type DuplicateGroup = Readonly<{
  key: string; 
  items: Contact[]; 
}>;


function toLike(c: Contact | ContactLike): ContactLike {
  return {
    name: "name" in c ? c.name : undefined,
    companyName: "companyName" in c ? c.companyName : undefined,
    email: "email" in c ? c.email : undefined,
    phone: "phone" in c ? c.phone : undefined,
  };
}


export function buildIdentityIndex(
  contacts: readonly Contact[],
  opts: UniquenessOptions = {}
): Map<string, Contact[]> {
  const index = new Map<string, Contact[]>();
  for (const c of contacts ?? []) {
    const key = makeContactIdentityKey(
      {
        email: normalizeEmail(c.email),
        phone: normalizePhone(c.phone),
        name: normalizeName(c.name),
        companyName: normalizeCompany(c.companyName),
      },
      opts
    );
    const bucket = index.get(key);
    if (bucket) bucket.push(c);
    else index.set(key, [c]);
  }
  return index;
}

export function isDuplicateContact(
  candidate: Contact | ContactLike,
  existing: readonly Contact[],
  opts: UniquenessOptions = {}
): { duplicate: boolean; key: string; match?: Contact } {
  const like = toLike(candidate);

  const key = makeContactIdentityKey(
    {
      email: normalizeEmail(like.email),
      phone: normalizePhone(like.phone),
      name: normalizeName(like.name),
      companyName: normalizeCompany(like.companyName),
    },
    opts
  );
  const index = buildIdentityIndex(existing, opts);
  const bucket = index.get(key);
  if (bucket && bucket.length > 0) {
    for (const item of bucket) {
      if (areContactsPotentialDuplicates(like, item, opts)) {
        return { duplicate: true, key, match: item };
      }
    }
  }
  for (const item of existing ?? []) {
    if (areContactsPotentialDuplicates(like, item, opts)) {
      return { duplicate: true, key, match: item };
    }
  }

  return { duplicate: false, key };
}

export function listPotentialDuplicates(
  candidate: Contact | ContactLike,
  existing: readonly Contact[],
  opts: UniquenessOptions = {}
): Contact[] {
  const like = toLike(candidate);
  const out: Contact[] = [];
  for (const item of existing ?? []) {
    if (areContactsPotentialDuplicates(like, item, opts)) {
      out.push(item);
    }
  }
  return out;
}

export function findDuplicateGroups(
  contacts: readonly Contact[],
  opts: UniquenessOptions = {}
): DuplicateGroup[] {
  const index = buildIdentityIndex(contacts, opts);
  const result: DuplicateGroup[] = [];
  for (const [key, items] of index.entries()) {
    if ((items?.length ?? 0) > 1) {
      result.push({ key, items: [...items] });
    }
  }
  return result;
}

export function assertUniqueContact(
  candidate: Contact | ContactLike,
  existing: readonly Contact[],
  opts: UniquenessOptions = {}
): void {
  const { duplicate, key, match } = isDuplicateContact(
    candidate,
    existing,
    opts
  );
  if (duplicate && match) {
    const details = {
      identityKey: key,
      duplicateOf: {
        id: match?.id,
        name: match?.name,
        email: match?.email,
        phone: match?.phone,
      },
    } as Record<string, unknown>;
    throw new BusinessRuleError("CONFLICT", "Duplicate contact detected", { details });
  }
}
