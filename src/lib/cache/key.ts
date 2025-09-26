// key.ts
// Serializador estable para keys de queries (Map<string, Entry>).
// Acepta arreglos/objetos anidados (sin funciones).

export type QueryKey = readonly unknown[];

function stableSortObject(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj).sort()) {
    const v = (obj as any)[k];
    out[k] =
      v && typeof v === "object" && !Array.isArray(v)
        ? stableSortObject(v as Record<string, unknown>)
        : v;
  }
  return out;
}

export function serializeKey(key: QueryKey): string {
  const normalize = (v: unknown): unknown => {
    if (v === null || v === undefined) return v;
    if (Array.isArray(v)) return v.map(normalize);
    if (typeof v === "object")
      return stableSortObject(v as Record<string, unknown>);
    return v;
  };
  try {
    return JSON.stringify(key.map(normalize));
  } catch {
    // Fallback: toString (debería evitarse, pero no rompe)
    return String(key);
  }
}
