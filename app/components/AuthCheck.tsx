"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login"];

export default function AuthCheck({
  children,
  pathName,
}: {
  children: ReactNode;
  pathName: string;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const isPublicRoute = publicRoutes.some((route) => pathName === route || pathName.startsWith(route));
  
  // Efecto para manejar redirecciones
  useEffect(() => {
    if (status === "unauthenticated" && !isPublicRoute) {
      setIsRedirecting(true);
      router.push("/login");
    } else if (status === "authenticated" && isPublicRoute) {
      const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      const forceLogoutParam = urlParams.get('forceLogout');
      
      if (forceLogoutParam !== 'true') {
        setIsRedirecting(true);
        router.push("/");
      }
    } else {
      setIsRedirecting(false);
    }
  }, [status, isPublicRoute, pathName, router]);
  
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-purple-500 animate-ping opacity-20"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Cargando...</p>
      </div>
    );
  }
  
  // Mostrar loading mientras se redirige
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-purple-500 animate-ping opacity-20"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Redirigiendo...</p>
      </div>
    );
  }
  
  return <>{children}</>;
}
