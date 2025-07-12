import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const news = await prisma.news.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    
    // Limpiar datos para evitar problemas con campos null
    const cleanedNews = news.map(item => ({
      ...item,
      endDate: item.endDate || null, // Convertir string vacío a null si es necesario
      image: item.image || null
    }));
    
    return NextResponse.json(cleanedNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Asegurar que endDate sea string vacío en lugar de null/undefined
    const newsData = {
      ...data,
      endDate: data.endDate || '',
      image: data.image || null
    };
    
    const newsItem = await prisma.news.create({ data: newsData });
    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const data = await req.json();
    
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    
    // Asegurar que endDate sea string vacío en lugar de null/undefined
    const updateData = {
      ...data,
      endDate: data.endDate || '',
      image: data.image || null
    };
    
    const updated = await prisma.news.update({ where: { id }, data: updateData });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 404 });
  }
} 