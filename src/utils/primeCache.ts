import type { StorageLayer } from "@/types";
import { getCachedData } from "../utils/cacheHelpers";

export function primeCache<T>(
  cacheKey: string,
  storage: StorageLayer,
  ttl: number,
  backgroundRefreshThreshold: number
): {
  cached: T | null;
  age: number;
  fromCache: boolean;
  shouldBackgroundRefresh: boolean;
} {
  const { data, age } = getCachedData<T>(cacheKey, storage, ttl);
  if (data == null) {
    return { cached: null, age: 0, fromCache: false, shouldBackgroundRefresh: false };
  }
  const shouldBackgroundRefresh = age > ttl * backgroundRefreshThreshold;
  return { cached: data, age, fromCache: true, shouldBackgroundRefresh };
}
