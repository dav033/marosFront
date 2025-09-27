// src/lib/query/client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Ajuste global sencillo; sus hooks pueden sobreescribirlo
      staleTime: 60_000, // 1 min
      gcTime: 5 * 60_000, // v5: tiempo de recolección
      // (si usa v4, puede cambiar a "cacheTime")
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
