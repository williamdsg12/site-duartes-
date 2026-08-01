import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
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
      prisma.serviceItem.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.galleryMedia.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.testimonialItem.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.faqItem.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      prisma.serviceAreaConfig.findUnique({ where: { id: "default" } }),
      prisma.socialConfig.findUnique({ where: { id: "default" } }),
      prisma.seoConfig.findUnique({ where: { id: "default" } }),
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
    ]);

    return NextResponse.json({
      info,
      hero,
      services,
      gallery,
      testimonials,
      faqs,
      serviceArea: serviceArea
        ? {
            ...serviceArea,
            cities: serviceArea.citiesJson ? JSON.parse(serviceArea.citiesJson) : [],
          }
        : null,
      social,
      seo,
      settings,
    });
  } catch (error) {
    console.error("Failed to fetch site data:", error);
    return NextResponse.json({ error: "Failed to load dynamic site data" }, { status: 500 });
  }
}
