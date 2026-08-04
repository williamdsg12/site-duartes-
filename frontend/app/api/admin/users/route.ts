import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const currentUser = await getSessionUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores podem criar usuários" }, { status: 403 });
  }

  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Preencha todos os campos obrigatórios" }, { status: 400 });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    return NextResponse.json({ error: "Já existe um usuário cadastrado com este e-mail" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.user.create({
    data: {
      name,
      email: cleanEmail,
      passwordHash,
      role: role || "ADMIN",
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  await logAudit("CREATE_USER", currentUser.id, currentUser.email, "127.0.0.1", `Novo usuário criado: ${created.email}`);
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const currentUser = await getSessionUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores podem editar usuários" }, { status: 403 });
  }

  const { id, name, email, password, role } = await req.json();
  if (!id || !name || !email) {
    return NextResponse.json({ error: "ID, Nome e E-mail são obrigatórios" }, { status: 400 });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "Este e-mail já está em uso por outro usuário" }, { status: 400 });
  }

  const updateData: any = {
    name,
    email: cleanEmail,
    role: role || "ADMIN",
  };

  if (password && password.trim().length > 0) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  await logAudit("UPDATE_USER", currentUser.id, currentUser.email, "127.0.0.1", `Usuário atualizado: ${updated.email}`);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const currentUser = await getSessionUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas administradores podem excluir usuários" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

  if (id === currentUser.id) {
    return NextResponse.json({ error: "Você não pode excluir sua própria conta" }, { status: 400 });
  }

  const deleted = await prisma.user.delete({ where: { id } });
  await logAudit("DELETE_USER", currentUser.id, currentUser.email, "127.0.0.1", `Usuário excluído: ${deleted.email}`);
  return NextResponse.json({ success: true });
}
