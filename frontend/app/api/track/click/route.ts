import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buttonName, pageUrl = "/", device = "desktop", origin = "Direto" } = body;

    if (!buttonName) {
      return NextResponse.json({ error: "buttonName is required" }, { status: 400 });
    }

    await prisma.clickEvent.create({
      data: {
        buttonName,
        pageUrl,
        device,
        origin,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging click:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
