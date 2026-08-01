import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const services = await prisma.serviceItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await req.json();
  const created = await prisma.serviceItem.create({ data });
  await logAudit("CREATE_SERVICE", user.id, user.email, `Serviço criado: ${created.title}`);
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, ...data } = await req.json();
  const updated = await prisma.serviceItem.update({
    where: { id },
    data,
  });
  await logAudit("UPDATE_SERVICE", user.id, user.email, `Serviço atualizado: ${updated.title}`);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

  const deleted = await prisma.serviceItem.delete({ where: { id } });
  await logAudit("DELETE_SERVICE", user.id, user.email, `Serviço excluído: ${deleted.title}`);
  return NextResponse.json({ success: true });
}
