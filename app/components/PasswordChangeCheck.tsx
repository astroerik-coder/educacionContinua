"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  
  // Define a type that includes mustChangePassword
  type ExtendedSessionUser = {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    mustChangePassword?: boolean;
  };
  const router = useRouter();
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    const user = session?.user as ExtendedSessionUser | undefined;
    if (status === "authenticated" && user?.mustChangePassword) {
      if (path !== "/perfil/cambiar-clave") {
        router.push("/perfil/cambiar-clave");
      }
    }
  }, [session, status, router, path]);

  // Si el usuario debe cambiar su contraseña y NO está en la página de cambio de contraseña,
  // no renderizamos los hijos hasta que se complete el cambio
  const user = session?.user as ExtendedSessionUser | undefined;
  if (status === "authenticated" && user?.mustChangePassword && path !== "/perfil/cambiar-clave") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Redirigiendo...</h2>
          <p>Por seguridad, necesitas cambiar tu contraseña antes de continuar.</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado y no necesita cambiar su contraseña, o si está cargando
  // o no está autenticado, o si está en la página de cambio de contraseña, renderizamos normalmente
  return <>{children}</>;
}
