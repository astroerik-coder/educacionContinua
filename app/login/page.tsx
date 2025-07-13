"use client";
import { signIn, useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forceLogout, setForceLogout] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Forzar logout si el usuario viene directamente a login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const forceLogoutParam = urlParams.get('forceLogout');
    const messageParam = urlParams.get('message');
    
    if (forceLogoutParam === 'true' && status === 'authenticated') {
      signOut({ redirect: false });
      setForceLogout(true);
    }
    
    if (messageParam === 'password_changed') {
      setSuccessMessage("Contraseña actualizada correctamente. Puedes iniciar sesión con tu nueva contraseña.");
    }
  }, [status]);

  if (session && !forceLogout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center mb-4">Ya estás conectado</h2>
          <p className="text-center text-gray-600 mb-4">
            Ya tienes una sesión activa como {session.user?.email}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => router.replace("/admin")}
              className="flex-1 bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
            >
              Ir al Admin
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login?forceLogout=true" })}
              className="flex-1 bg-gray-500 text-white rounded px-4 py-2 font-semibold hover:bg-gray-600"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) setError("Credenciales incorrectas");
    if (res?.ok) router.replace("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded flex items-center mb-4">
            <Check className="w-5 h-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          autoComplete="current-password"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
       
      </form>
    </div>
  );
}
