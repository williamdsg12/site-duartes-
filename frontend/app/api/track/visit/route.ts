import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pageUrl = "/", device = "desktop", origin = "Direto" } = body;

    const userAgent = req.headers.get("user-agent") || undefined;
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    await prisma.visitorLog.create({
      data: {
        ip,
        pageUrl,
        device,
        origin,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging visit:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
