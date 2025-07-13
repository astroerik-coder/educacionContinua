"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

// Componente simple que envuelve el SessionProvider de NextAuth
export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider 
      refetchInterval={24 * 60 * 60} 
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      basePath="/api/auth"
      refetchInterval={0} // Desactivar refetch automático para evitar problemas
    >
      {children}
    </NextAuthSessionProvider>
  );
}
