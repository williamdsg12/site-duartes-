import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const seo = await prisma.seoConfig.findUnique({ where: { id: "default" } });
  return NextResponse.json(seo);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await req.json();
  const updated = await prisma.seoConfig.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  await logAudit("UPDATE_SEO_CONFIG", user.id, user.email, "Configurações de SEO atualizadas");
  return NextResponse.json(updated);
}
