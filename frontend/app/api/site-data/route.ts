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
      prisma.siteInfo.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.heroBanner.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.serviceItem.findMany({ where: { active: true }, orderBy: { order: "asc" } }).catch(() => []),
      prisma.galleryMedia.findMany({ where: { active: true }, orderBy: { order: "asc" } }).catch(() => []),
      prisma.testimonialItem.findMany({ where: { active: true }, orderBy: { order: "asc" } }).catch(() => []),
      prisma.faqItem.findMany({ where: { active: true }, orderBy: { order: "asc" } }).catch(() => []),
      prisma.serviceAreaConfig.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.socialConfig.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.seoConfig.findUnique({ where: { id: "default" } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { id: "default" } }).catch(() => null),
    ]);

    let parsedCities: string[] = [];
    if (serviceArea?.citiesJson) {
      try {
        parsedCities = JSON.parse(serviceArea.citiesJson);
      } catch {
        parsedCities = [];
      }
    }

    return NextResponse.json({
      info: info || null,
      hero: hero || null,
      services: services || [],
      gallery: gallery || [],
      testimonials: testimonials || [],
      faqs: faqs || [],
      serviceArea: serviceArea
        ? {
            ...serviceArea,
            cities: parsedCities,
          }
        : null,
      social: social || null,
      seo: seo || null,
      settings: settings || null,
    });
  } catch (error) {
    console.error("Failed to fetch site data:", error);
    return NextResponse.json({
      info: null,
      hero: null,
      services: [],
      gallery: [],
      testimonials: [],
      faqs: [],
      serviceArea: null,
      social: null,
      seo: null,
      settings: null,
    });
  }
}
