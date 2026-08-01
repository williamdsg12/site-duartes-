import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/reviews`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.error("Backend fetch error for reviews:", e);
    }
  }
  return NextResponse.json({
    configured: false,
    rating: null,
    total: null,
    reviews: [],
  });
}
