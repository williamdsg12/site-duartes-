import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const [
    info,
    hero,
    services,
    gallery,
    testimonials,
    faqs,
    serviceArea,
    social,
    seo,
    settings,
  ] = await Promise.all([
    prisma.siteInfo.findUnique({ where: { id: "default" } }),
    prisma.heroBanner.findUnique({ where: { id: "default" } }),
    prisma.serviceItem.findMany(),
    prisma.galleryMedia.findMany(),
    prisma.testimonialItem.findMany(),
    prisma.faqItem.findMany(),
    prisma.serviceAreaConfig.findUnique({ where: { id: "default" } }),
    prisma.socialConfig.findUnique({ where: { id: "default" } }),
    prisma.seoConfig.findUnique({ where: { id: "default" } }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const backupData = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    data: {
      info,
      hero,
      services,
      gallery,
      testimonials,
      faqs,
      serviceArea,
      social,
      seo,
      settings,
    },
  };

  await logAudit("EXPORT_BACKUP", user.id, user.email, "Backup do site exportado em JSON");

  return new Response(JSON.stringify(backupData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="duartes-backup-${Date.now()}.json"`,
    },
  });
}
