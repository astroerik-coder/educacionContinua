"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

// This file is deprecated - use SessionProvider.tsx instead
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
