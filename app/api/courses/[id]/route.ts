import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/courses/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching course" }, { status: 500 });
  }
}

// PUT /api/courses/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const course = await prisma.course.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: "Error updating course" }, { status: 500 });
  }
}

// DELETE /api/courses/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.course.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting course" }, { status: 500 });
  }
}
