"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { SettingsProvider } from "@/providers/SettingsProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <SettingsProvider>
          {children}
          <Toaster richColors position="top-right" />
        </SettingsProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}