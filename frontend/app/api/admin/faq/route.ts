import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const faqs = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await req.json();
  const created = await prisma.faqItem.create({ data });
  await logAudit("CREATE_FAQ", user.id, user.email, `Pergunta FAQ criada: ${created.question}`);
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, ...data } = await req.json();
  const updated = await prisma.faqItem.update({
    where: { id },
    data,
  });
  await logAudit("UPDATE_FAQ", user.id, user.email, `Pergunta FAQ atualizada: ${updated.question}`);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

  const deleted = await prisma.faqItem.delete({ where: { id } });
  await logAudit("DELETE_FAQ", user.id, user.email, `Pergunta FAQ excluída: ${deleted.question}`);
  return NextResponse.json({ success: true });
}
