"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Settings, Eye, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";

// Importar los componentes dinámicamente para evitar problemas de importación circular
const AdminPanel = dynamic(() => import("./components/AdminPanel"));
const PublicDisplay = dynamic(() => import("./components/PublicDisplay"));

function Navigation() {
  const [currentView, setCurrentView] = useState("public");
  const { session, isLoading } = useAuth();

  // Mostrar loading si la sesión no está lista
  if (isLoading || !session) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img
                src="/ECESPEL.jpg"
                alt="ESPE"
                className="w-36 h-36 object-contain mr-3 rounded-full shadow"
              />
              <h1 className="text-xl font-bold text-gray-900">
                Centro de Educación Continua ESPE-Latacunga
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("public")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === "public"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Vista Pública
              </button>
              <button
                onClick={() => setCurrentView("admin")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Administración
              </button>
              <div className="flex items-center space-x-2 border-l pl-4">
                <span className="text-sm text-gray-600">
                  {session?.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login?forceLogout=true" })}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-screen mx-auto py-auto sm:px-auto lg:px-auto">
        {currentView === "public" ? <PublicDisplay /> : <AdminPanel />}
      </main>
    </div>
  );
}

export default function HomePage() {
  const { status, isAuthenticated, mustChangePassword, isLoading } = useAuth();
  const router = useRouter();
  
  // Efecto para manejar redirecciones
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (mustChangePassword) {
        router.push("/perfil/cambiar-clave");
      }
    }
  }, [isLoading, isAuthenticated, mustChangePassword, router]);
  
  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Cargando aplicación...</h2>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // No renderizar nada mientras se redirige
  if (!isAuthenticated || mustChangePassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Redirigiendo...</h2>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar la aplicación normal
  return <Navigation />;
}
