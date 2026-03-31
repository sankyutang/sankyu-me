import { getPayloadClient } from "@/lib/payload";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const payload = await getPayloadClient();
  const posts = await payload.find({
    collection: "posts",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 50,
    depth: 0,
  });

  const items = posts.docs
    .map((p) => {
      const link = `${base}/blog/${p.slug}`;
      const pub = p.publishedAt ? new Date(p.publishedAt).toUTCString() : "";
      return (
        `<item>` +
        `<title>${escapeXml(p.title)}</title>` +
        `<link>${link}</link>` +
        `<guid>${link}</guid>` +
        (pub ? `<pubDate>${pub}</pubDate>` : "") +
        (p.excerpt ? `<description>${escapeXml(p.excerpt)}</description>` : "") +
        `</item>`
      );
    })
    .join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0">` +
    `<channel>` +
    `<title>sankyu.me Blog</title>` +
    `<link>${base}/blog</link>` +
    `<description>Latest posts from sankyu.me</description>` +
    items +
    `</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
