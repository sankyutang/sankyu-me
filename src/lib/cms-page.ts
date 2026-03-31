import { getPayloadClient } from "@/lib/payload";

export type StaticPageType = "about" | "now" | "uses" | "links";

export async function getPublishedPageByType(pageType: StaticPageType) {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "pages",
    where: {
      and: [{ pageType: { equals: pageType } }, { status: { equals: "published" } }],
    },
    limit: 1,
    depth: 1,
  });
  return res.docs[0] ?? null;
}
