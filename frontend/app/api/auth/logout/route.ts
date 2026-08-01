import { NextResponse } from "next/server";
import { getSessionUser, clearAuthCookie, logAudit } from "@/lib/auth";

export async function POST() {
  const user = await getSessionUser();
  if (user) {
    await logAudit("LOGOUT", user.id, user.email, "Logout efetuado");
  }
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
