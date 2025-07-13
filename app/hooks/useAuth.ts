"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Marcar como listo después de que la sesión se haya cargado
    if (status !== "loading") {
      setIsReady(true);
    }
  }, [status]);

  return {
    session,
    status,
    isReady,
    isAuthenticated: status === "authenticated" && !!session,
    isLoading: status === "loading" || !isReady,
    mustChangePassword: session?.user?.mustChangePassword || false,
  };
} 