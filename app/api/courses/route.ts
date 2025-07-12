import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Validación mínima
  if (!data.formUrl) {
    return NextResponse.json(
      { error: "formUrl es requerido" },
      { status: 400 }
    );
  }

  try {
    const qrCode = await QRCode.toDataURL(data.formUrl, { width: 200 });
    const course = await prisma.course.create({
      data: {
        ...data,
        qrCode,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el curso" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const data = await req.json();

  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  try {
    const qrCode = await QRCode.toDataURL(data.formUrl, { width: 200 });
    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...data,
        qrCode,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar" },
      { status: 404 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  try {
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 404 });
  }
}
