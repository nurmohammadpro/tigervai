"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { setQueryClient } from "./poacktbase";

const queryClient = new QueryClient();

setQueryClient(queryClient);
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom"
        buttonPosition="top-right"
      />
      {children}
    </QueryClientProvider>
  );
}
