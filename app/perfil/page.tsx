"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { User, Settings, LogOut, Key } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

type PerfilUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  mustChangePassword?: boolean;
};

export default function PerfilPage() {
  const [user, setUser] = useState<PerfilUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { toast } = useToast();
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function fetchPerfil() {
      setLoading(true);
      const res = await fetch("/api/perfil");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.error) {
        router.push("/login");
        return;
      }
      setUser(data);
      setEditName(data.name || "");
      setEditEmail(data.email || "");
      setEditImage(data.image || "");
      setLoading(false);
    }
    fetchPerfil();
  }, [router]);

  useEffect(() => {
    if (user?.mustChangePassword) {
      setPasswordOpen(true);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); 
  };
  const handleEdit = async () => {
    setEditLoading(true);
    // Aquí iría la llamada a la API para editar perfil
    setTimeout(() => {
      setEditLoading(false);
      setEditOpen(false);
      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido guardados.",
      });
      setUser((prev) =>
        prev
          ? { ...prev, name: editName, email: editEmail, image: editImage }
          : prev
      );
    }, 1200);
  };

  const handlePassword = async () => {
    if (password1 !== password2) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }
    setPasswordLoading(true);
    // Aquí iría la llamada a la API para cambiar contraseña
    setTimeout(() => {
      setPasswordLoading(false);
      setPasswordOpen(false);
      toast({
        title: "Contraseña cambiada",
        description: "Tu contraseña ha sido actualizada.",
      });
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Cargando perfil...</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="w-24 h-24 mb-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Usuario"}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-blue-600 mx-auto" />
            )}
          </Avatar>
          <h1 className="text-2xl font-bold">{user.name || "Usuario"}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <div className="space-y-4">
          {/* Modal para editar perfil */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full flex items-center justify-between"
                variant="outline"
              >
                <Settings className="w-5 h-5 text-blue-600 mr-3" /> Editar
                perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar perfil</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <input
                  className="w-full border rounded p-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nombre"
                />
                <input
                  className="w-full border rounded p-2"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                />
                <input
                  className="w-full border rounded p-2"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="URL de imagen"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleEdit} disabled={editLoading}>
                  {editLoading ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal para cambiar contraseña */}
          <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full flex items-center justify-between"
                variant="outline"
              >
                <Key className="w-5 h-5 text-blue-600 mr-3" /> Cambiar
                contraseña
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cambiar contraseña</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <input
                  type="password"
                  className="w-full border rounded p-2"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  placeholder="Nueva contraseña"
                />
                <input
                  type="password"
                  className="w-full border rounded p-2"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Repetir contraseña"
                />
              </div>
              <DialogFooter>
                <Button onClick={handlePassword} disabled={passwordLoading}>
                  {passwordLoading ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Botón para cerrar sesión */}
          <Button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between"
            variant="destructive"
          >
            <LogOut className="w-5 h-5 mr-3" /> Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
