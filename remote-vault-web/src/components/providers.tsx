"use client";

import { SessionProvider } from "next-auth/react";
import { NetworkGuard } from "./NetworkGuard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NetworkGuard>
        {children}
      </NetworkGuard>
    </SessionProvider>
  );
}
