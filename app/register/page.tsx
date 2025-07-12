"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Registrar Administrador</h2>
        
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded px-3 py-2"
          autoComplete="name"
        />
        
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
          autoComplete="new-password"
          required
          minLength={6}
        />
        
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">Usuario creado correctamente. Redirigiendo...</div>}
        
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          disabled={loading || success}
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
        
        <div className="text-center mt-4">
          <a href="/login" className="text-blue-600 text-sm hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
}
