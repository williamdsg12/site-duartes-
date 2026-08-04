import { NextResponse } from "next/server";
import { getSessionUser, clearAuthCookie, logAudit } from "@/lib/auth";

export async function POST() {
  const user = await getSessionUser();
  if (user) {
    await logAudit("LOGOUT", user.id, user.email, "127.0.0.1", "Logout manual efetuado");
  }
  await clearAuthCookie();
  const response = NextResponse.json({ success: true });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
