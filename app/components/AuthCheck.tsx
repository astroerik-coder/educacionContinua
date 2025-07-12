"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login", "/register"];

export default function AuthCheck({
  children,
  pathName,
}: {
  children: ReactNode;
  pathName: string;
}) {
  const { data: session, status } = useSession();
  
  const isPublicRoute = publicRoutes.some((route) => pathName === route || pathName.startsWith(route));
  
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
  
  // Redirigir a login si no está autenticado y no es una ruta pública
  if (status === "unauthenticated" && !isPublicRoute) {
    redirect("/login");
  }
  
  // Redirigir a home si está autenticado y está intentando acceder a login
  if (status === "authenticated" && isPublicRoute) {
    redirect("/");
  }
  
  return <>{children}</>;
}
