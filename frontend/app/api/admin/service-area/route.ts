import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const area = await prisma.serviceAreaConfig.findUnique({ where: { id: "default" } });
  return NextResponse.json(
    area
      ? { ...area, cities: area.citiesJson ? JSON.parse(area.citiesJson) : [] }
      : null
  );
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { cities, ...rest } = await req.json();
  const data = {
    ...rest,
    citiesJson: Array.isArray(cities) ? JSON.stringify(cities) : JSON.stringify([]),
  };

  const updated = await prisma.serviceAreaConfig.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  await logAudit("UPDATE_SERVICE_AREA", user.id, user.email, "Área de atendimento atualizada");
  return NextResponse.json({
    ...updated,
    cities: updated.citiesJson ? JSON.parse(updated.citiesJson) : [],
  });
}
