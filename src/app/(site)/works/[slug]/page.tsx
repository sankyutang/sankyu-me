import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { RichTextRenderer } from "@/components/rich-text";
import { buttonVariants } from "@/components/ui/button-variants";
import { getMediaUrl } from "@/lib/media";
import { getPayloadClient } from "@/lib/payload";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "works",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  const work = res.docs[0];
  if (!work) {
    return {};
  }
  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const og =
    getMediaUrl(typeof work.ogImage === "object" ? work.ogImage : null) ||
    getMediaUrl(typeof work.coverImage === "object" ? work.coverImage : null);

  return {
    title: work.seoTitle || work.title,
    description: work.seoDescription || work.summary || undefined,
    openGraph: {
      title: work.seoTitle || work.title,
      description: work.seoDescription || work.summary || undefined,
      url: `${base}/works/${work.slug}`,
      images: og ? [{ url: og }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: work.seoTitle || work.title,
      description: work.seoDescription || work.summary || undefined,
      images: og ? [og] : undefined,
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const res = await payload.find({
    collection: "works",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  const work = res.docs[0];
  if (!work) {
    notFound();
  }

  const cover = getMediaUrl(typeof work.coverImage === "object" ? work.coverImage : null);
  const og =
    getMediaUrl(typeof work.ogImage === "object" ? work.ogImage : null) || cover;
  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    description: work.summary || work.seoDescription,
    image: og ? [og] : undefined,
    url: `${base}/works/${work.slug}`,
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={jsonLd} />

      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{work.title}</h1>
      {work.summary ? (
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{work.summary}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {work.externalUrl ? (
          <Link
            href={work.externalUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            打开外链
          </Link>
        ) : null}
      </div>

      {cover ? (
        <div className="bg-muted relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={cover} alt="" fill className="object-cover" priority sizes="100vw" />
        </div>
      ) : null}

      {work.content ? (
        <div className="mt-12">
          <RichTextRenderer data={work.content} />
        </div>
      ) : null}

      <p className="mt-10 text-sm">
        <Link href="/works" className="text-muted-foreground hover:text-foreground underline">
          ← 全部作品
        </Link>
      </p>
    </div>
  );
}
