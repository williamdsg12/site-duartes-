import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 1800; // 30-minute ISR cache

function cleanInstagramUsername(urlOrHandle: string): string {
  if (!urlOrHandle) return "duarteslimpezacaixadeagua";
  let clean = urlOrHandle.trim().replace(/^@/, "");
  clean = clean.replace(/https?:\/\/(www\.)?instagram\.com\//i, "");
  clean = clean.split("/")[0].split("?")[0];
  return clean || "duarteslimpezacaixadeagua";
}

export async function GET() {
  try {
    const social = await prisma.socialConfig.findUnique({ where: { id: "default" } }).catch(() => null);
    const rawInsta = social?.instagram || "https://instagram.com/duarteslimpezacaixadeagua";
    const username = cleanInstagramUsername(rawInsta);
    const profileUrl = `https://instagram.com/${username}`;

    const token = social?.instaToken || process.env.INSTAGRAM_ACCESS_TOKEN || process.env.INSTAGRAM_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID || "me";

    if (token) {
      try {
        const url = `https://graph.instagram.com/v18.0/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count&access_token=${token}&limit=12`;
        const res = await fetch(url, { next: { revalidate: 1800 } });

        if (res.ok) {
          const json = await res.json();
          const items = (json.data || []).map((m: any) => ({
            id: m.id,
            caption: m.caption || `Post @${username}`,
            media_type: m.media_type,
            media_url: m.media_url || m.thumbnail_url,
            thumbnail_url: m.thumbnail_url || m.media_url,
            permalink: m.permalink || profileUrl,
            timestamp: m.timestamp,
            like_count: m.like_count || null,
          }));

          return NextResponse.json({ configured: true, username, profileUrl, items });
        }
      } catch (e) {
        console.error("Instagram Graph API Fetch Error:", e);
      }
    }

    const galleryItems = await prisma.galleryMedia
      .findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      })
      .catch(() => []);

    const items = galleryItems.map((g) => ({
      id: g.id,
      caption: g.alt || `Trabalho publicado no Instagram @${username}`,
      media_type: "IMAGE",
      media_url: g.src,
      thumbnail_url: g.src,
      permalink: g.permalink || profileUrl,
      timestamp: g.createdAt ? g.createdAt.toISOString() : undefined,
      like_count: null,
    }));

    return NextResponse.json({
      configured: true,
      username,
      profileUrl,
      items,
    });
  } catch (error) {
    console.error("Instagram Feed API Error:", error);
    return NextResponse.json({
      configured: false,
      username: "duarteslimpezacaixadeagua",
      profileUrl: "https://instagram.com/duarteslimpezacaixadeagua",
      items: [],
    });
  }
}
