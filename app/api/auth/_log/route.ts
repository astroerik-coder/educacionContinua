import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // This is a simple implementation to handle NextAuth logging
  // In production, you might want to add proper logging
  try {
    const body = await request.json();
    console.log("[NextAuth] Log:", body);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[NextAuth] Error logging:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
