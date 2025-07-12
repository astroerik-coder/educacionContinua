import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/masters/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const master = await prisma.master.findUnique({
      where: { id: params.id },
    });
    if (!master) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(master);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching master" }, { status: 500 });
  }
}

// PUT /api/masters/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const master = await prisma.master.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(master);
  } catch (error) {
    return NextResponse.json({ error: "Error updating master" }, { status: 500 });
  }
}

// DELETE /api/masters/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.master.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting master" }, { status: 500 });
  }
}
