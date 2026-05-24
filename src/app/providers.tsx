"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { SettingsProvider } from "@/providers/SettingsProvider";
import "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

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