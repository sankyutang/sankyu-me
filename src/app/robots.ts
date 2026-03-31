import type { MetadataRoute } from "next";

const base = () => process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  const root = base();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${root}/sitemap.xml`,
  };
}
