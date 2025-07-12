"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check } from "lucide-react";

export default function ChangePasswordPage() {
  const { data: session } = useSession();
  // Use the same type assertion as in PasswordChangeCheck
  type ExtendedSessionUser = {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    mustChangePassword?: boolean;
  };
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redireccionar si no hay sesión
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al cambiar la contraseña");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redireccionar después de 3 segundos
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Cambiar Contraseña</h1>
        
        {(session?.user as ExtendedSessionUser | undefined)?.mustChangePassword && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded flex items-center mb-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Por razones de seguridad, debes cambiar tu contraseña antes de continuar.</span>
          </div>
        )}
        
        {success ? (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded flex items-center mb-4">
            <Check className="w-5 h-5 mr-2" />
            <span>Contraseña actualizada correctamente. Redirigiendo...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="current-password"
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="new-password"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-2 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Actualizando...
                </>
              ) : (
                "Cambiar Contraseña"
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 text-center text-sm mt-2"
            >
              Volver
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
