import type { MetadataRoute } from "next";

import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

const base = () => process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient();
  const root = base();

  const [posts, products, podcasts, pages] = await Promise.all([
    payload.find({ collection: "posts", where: { status: { equals: "published" } }, limit: 500 }),
    payload.find({ collection: "products", limit: 500 }),
    payload.find({ collection: "podcasts", where: { status: { equals: "published" } }, limit: 500 }),
    payload.find({ collection: "pages", where: { status: { equals: "published" } }, limit: 100 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/products",
    "/podcast",
    "/about",
    "/now",
    "/uses",
    "/links",
    "/newsletter",
    "/search",
  ].map((path) => ({
    url: `${root}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const blogUrls: MetadataRoute.Sitemap = posts.docs.map((p) => ({
    url: `${root}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productUrls: MetadataRoute.Sitemap = products.docs.map((p) => ({
    url: `${root}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const podcastUrls: MetadataRoute.Sitemap = podcasts.docs.map((p) => ({
    url: `${root}/podcast/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const pageUrls: MetadataRoute.Sitemap = pages.docs.map((p) => ({
    url: `${root}/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...blogUrls, ...productUrls, ...podcastUrls, ...pageUrls];
}
