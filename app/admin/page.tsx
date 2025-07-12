"use client";
import { useSession, signOut } from "next-auth/react";
import AdminPanel from "../components/AdminPanel";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-end p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
      <AdminPanel />
    </div>
  );
}
