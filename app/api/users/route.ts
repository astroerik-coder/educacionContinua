import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface CreateUserRequest {
  name?: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateUserRequest;
    const { name, email, password } = body;
    
    // Validar datos
    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "El email ya está en uso" }, { status: 400 });
    }
    
    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    // Retornar usuario sin contraseña
    return NextResponse.json({ 
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
