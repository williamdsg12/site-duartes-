import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "duartes-limpezas-secret-key-2026";
const TOKEN_NAME = "duartes_admin_token";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user
      .findUnique({
        where: { id: payload.userId },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      })
      .catch(() => null);

    return user;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (e) {
    console.error("setAuthCookie error:", e);
  }
}

export async function clearAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } catch (e) {
    console.error("clearAuthCookie error:", e);
  }
}

export async function logAudit(action: string, userId?: string, email?: string, details?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        userId: userId || null,
        userEmail: email || null,
        details: details || null,
      },
    });
  } catch (e) {
    console.error("Audit log error:", e);
  }
}
