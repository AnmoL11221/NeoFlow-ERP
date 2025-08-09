"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCProvider } from "~/components/providers/trpc-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCProvider>{children}</TRPCProvider>
    </SessionProvider>
  );
}