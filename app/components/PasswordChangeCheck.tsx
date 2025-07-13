"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

// Define locally until global declaration is properly applied
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mustChangePassword?: boolean;
    }
  }
}

export default function PasswordChangeCheck({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Define a type that includes mustChangePassword
  type ExtendedSessionUser = {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    mustChangePassword?: boolean;
  };

  useEffect(() => {
    const user = session?.user as ExtendedSessionUser | undefined;
    
    if (status === "authenticated" && user?.mustChangePassword) {
      if (pathname !== "/perfil/cambiar-clave") {
        setIsRedirecting(true);
        router.push("/perfil/cambiar-clave");
      } else {
        setIsRedirecting(false);
      }
    } else {
      setIsRedirecting(false);
    }
  }, [session, status, router, pathname]);

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Cargando...</h2>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Si el usuario debe cambiar su contraseña y NO está en la página de cambio de contraseña,
  // mostrar pantalla de redirección
  const user = session?.user as ExtendedSessionUser | undefined;
  if (status === "authenticated" && user?.mustChangePassword && pathname !== "/perfil/cambiar-clave") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">
            {isRedirecting ? "Redirigiendo..." : "Acceso Restringido"}
          </h2>
          <p className="mb-4">Por seguridad, necesitas cambiar tu contraseña antes de continuar.</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          {!isRedirecting && (
            <button
              onClick={() => router.push("/perfil/cambiar-clave")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ir a Cambiar Contraseña
            </button>
          )}
        </div>
      </div>
    );
  }

  // Renderizar normalmente en todos los otros casos
  return <>{children}</>;
}
