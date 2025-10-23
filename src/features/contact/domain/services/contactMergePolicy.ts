import type { Contact } from "@/contact";



function isDefined<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}

export function mergeContact(
  local: Contact,
  api?: Partial<Contact> | null
): Contact {
  if (!api) return { ...local };
  const merged: Contact = {
    id: local.id, 
    companyName: isDefined(api.companyName)
      ? api.companyName
      : local.companyName,
    name: isDefined(api.name) ? api.name : local.name,
    occupation: isDefined(api.occupation) ? api.occupation : local.occupation,
    product: isDefined(api.product) ? api.product : local.product,
    phone: isDefined(api.phone) ? api.phone : local.phone,
    email: isDefined(api.email) ? api.email : local.email,
    address: isDefined(api.address) ? api.address : local.address,
    lastContact: isDefined(api.lastContact)
      ? api.lastContact
      : local.lastContact,
  };

  return merged;
}

export function mergeApiUpdateFallback(
  local: Contact,
  apiResult?: Contact | Partial<Contact> | null
): Contact {
  if (!apiResult) return { ...local };
  return mergeContact(local, apiResult);
}

export function mergeContactIntoCollection(
  collection: readonly Contact[],
  updated: Contact
): Contact[] {
  const list = Array.isArray(collection) ? collection : [];
  let replaced = false;
  const out = list.map((c) => {
    if (c.id === updated.id) {
      replaced = true;
      return updated;
    }
    return c;
  });
  return replaced ? out : [updated, ...out];
}
