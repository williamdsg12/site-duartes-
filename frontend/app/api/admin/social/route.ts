import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, logAudit } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const social = await prisma.socialConfig.findUnique({ where: { id: "default" } });
  return NextResponse.json(social);
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await req.json();
  const updated = await prisma.socialConfig.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  await logAudit("UPDATE_SOCIAL_LINKS", user.id, user.email, "Redes sociais e token do Instagram atualizados");
  return NextResponse.json(updated);
}

export async function POST(req: Request) {
  // Sync Instagram Graph API posts directly to DB gallery
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const social = await prisma.socialConfig.findUnique({ where: { id: "default" } });
    const token = social?.instaToken || process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Insira o Token do Instagram no formulário acima para sincronizar." },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://graph.instagram.com/v18.0/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count&access_token=${token}&limit=12`
    );

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errJson.error?.message || "Token do Instagram inválido ou expirado." },
        { status: 400 }
      );
    }

    const data = await res.json();
    const items = data.data || [];

    let count = 0;
    for (const m of items) {
      const mediaUrl = m.media_url || m.thumbnail_url;
      if (!mediaUrl) continue;

      const existing = await prisma.galleryMedia.findFirst({
        where: { permalink: m.permalink },
      });

      if (!existing) {
        await prisma.galleryMedia.create({
          data: {
            src: mediaUrl,
            fullSrc: mediaUrl,
            alt: m.caption ? m.caption.slice(0, 150) : "Publicação no Instagram",
            permalink: m.permalink,
            order: count + 1,
            active: true,
          },
        });
        count++;
      }
    }

    await logAudit("SYNC_INSTAGRAM_POSTS", user.id, user.email, `Sincronizados ${count} posts do Instagram`);

    return NextResponse.json({
      success: true,
      message: `Sincronizados ${count} novos posts do Instagram para a galeria!`,
      count,
    });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Erro ao sincronizar com Instagram" }, { status: 500 });
  }
}
