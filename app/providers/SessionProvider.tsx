"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

// Componente simple que envuelve el SessionProvider de NextAuth
export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider 
      refetchInterval={5 * 60} 
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
      basePath="/api/auth"
    >
      {children}
    </NextAuthSessionProvider>
  );
}
