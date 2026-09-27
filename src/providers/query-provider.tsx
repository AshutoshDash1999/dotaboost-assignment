"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000, // 5 min — data stays fresh, no background refetch
        gcTime: 10 * 60_000, // 10 min — keep unused cache before GC (was cacheTime pre-v5)
        retry: 2, // retry failed queries twice
        refetchOnWindowFocus: false, // disable noisy refetch on tab switch
      },
      mutations: {
        retry: 0, // never retry mutations by default
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // One client per component instance, so server renders don't share a cache across requests
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
