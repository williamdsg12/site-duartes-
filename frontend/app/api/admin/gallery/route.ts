import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const items = await prisma.galleryMedia.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await req.json();
  const created = await prisma.galleryMedia.create({ data });
  await logAudit("ADD_GALLERY_IMAGE", user.id, user.email, `Imagem adicionada à galeria: ${created.alt}`);
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, ...data } = await req.json();
  const updated = await prisma.galleryMedia.update({
    where: { id },
    data,
  });
  await logAudit("UPDATE_GALLERY_IMAGE", user.id, user.email, `Imagem da galeria atualizada ID: ${id}`);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

  await prisma.galleryMedia.delete({ where: { id } });
  await logAudit("DELETE_GALLERY_IMAGE", user.id, user.email, `Imagem excluída da galeria ID: ${id}`);
  return NextResponse.json({ success: true });
}
