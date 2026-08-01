import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const info = await prisma.siteInfo.findUnique({ where: { id: "default" } });
  return NextResponse.json(info);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await req.json();
  const updated = await prisma.siteInfo.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  await logAudit("UPDATE_GENERAL_INFO", user.id, user.email, "Informações gerais atualizadas");
  return NextResponse.json(updated);
}
