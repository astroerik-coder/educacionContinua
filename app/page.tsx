"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Settings, Eye } from "lucide-react";

// Importar los componentes dinámicamente para evitar problemas de importación circular
const AdminPanel = dynamic(() => import("./components/AdminPanel"));
const PublicDisplay = dynamic(() => import("./components/PublicDisplay"));

function Navigation() {
  const [currentView, setCurrentView] = useState("public");

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
  return <Navigation />;
}
