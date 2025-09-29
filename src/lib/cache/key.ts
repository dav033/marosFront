
export type QueryKey = readonly unknown[];

export function serializeKey(key: QueryKey): string {
  return JSON.stringify(key, (_k, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return Object.keys(v).sort().reduce((acc, k) => {
        
        acc[k] = v[k];
        return acc;
      }, {} as Record<string, unknown>);
    }
    return v;
  });
}
