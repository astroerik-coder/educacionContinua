import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const masters = await prisma.master.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(masters);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const master = await prisma.master.create({ data });
  return NextResponse.json(master);
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const data = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    const updated = await prisma.master.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  try {
    await prisma.master.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 404 });
  }
} 