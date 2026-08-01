import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const items = await prisma.testimonialItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await req.json();
  const created = await prisma.testimonialItem.create({ data });
  await logAudit("CREATE_TESTIMONIAL", user.id, user.email, `Depoimento adicionado: ${created.name}`);
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, ...data } = await req.json();
  const updated = await prisma.testimonialItem.update({
    where: { id },
    data,
  });
  await logAudit("UPDATE_TESTIMONIAL", user.id, user.email, `Depoimento atualizado: ${updated.name}`);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

  const deleted = await prisma.testimonialItem.delete({ where: { id } });
  await logAudit("DELETE_TESTIMONIAL", user.id, user.email, `Depoimento excluído: ${deleted.name}`);
  return NextResponse.json({ success: true });
}
