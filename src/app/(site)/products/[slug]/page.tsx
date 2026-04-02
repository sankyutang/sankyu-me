import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { PostCard } from "@/components/post-card";
import { RichTextRenderer } from "@/components/rich-text";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMediaUrl } from "@/lib/media";
import { getPayloadClient } from "@/lib/payload";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  const product = res.docs[0];
  if (!product) {
    return {};
  }
  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const og =
    getMediaUrl(typeof product.ogImage === "object" ? product.ogImage : null) ||
    getMediaUrl(typeof product.coverImage === "object" ? product.coverImage : null);

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.summary || undefined,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.summary || undefined,
      url: `${base}/products/${product.slug}`,
      images: og ? [{ url: og }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.summary || undefined,
      images: og ? [og] : undefined,
    },
  };
}

const statusLabel: Record<string, string> = {
  active: "Active",
  "coming-soon": "Coming soon",
  archived: "Archived",
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const res = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  const product = res.docs[0];
  if (!product) {
    notFound();
  }

  const settings = await payload.findGlobal({ slug: "site-settings" }).catch(() => null);
  const cover = getMediaUrl(typeof product.coverImage === "object" ? product.coverImage : null);
  const og =
    getMediaUrl(typeof product.ogImage === "object" ? product.ogImage : null) || cover;
  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary || product.seoDescription,
    image: og ? [og] : undefined,
    offers: product.priceText
      ? {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: product.externalUrl || `${base}/products/${product.slug}`,
        }
      : undefined,
  };

  const relatedPosts =
    product.relatedPosts?.filter((r: unknown): r is Record<string, unknown> =>
      typeof r === "object" && r !== null,
    ) ?? [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={productJsonLd} />
      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="outline">{product.productType.replace(/-/g, " ")}</Badge>
        <Badge variant="secondary">{statusLabel[product.status] ?? product.status}</Badge>
        {product.priceText ? <span className="text-muted-foreground">{product.priceText}</span> : null}
      </div>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{product.name}</h1>
      {product.summary ? (
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{product.summary}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {product.externalUrl ? (
          <Link
            href={product.externalUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            {product.ctaText || "Get it"}
          </Link>
        ) : null}
      </div>

      {cover ? (
        <div className="bg-muted relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={cover} alt="" fill className="object-cover" priority sizes="100vw" />
        </div>
      ) : null}

      {product.content ? (
        <div className="mt-12">
          <RichTextRenderer data={product.content} />
        </div>
      ) : null}

      {product.highlights && product.highlights.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <ul className="mt-4 space-y-3">
            {product.highlights.map((h: { title: string; description?: string | null }, i: number) => (
              <li key={i}>
                <strong>{h.title}</strong>
                {h.description ? (
                  <span className="text-muted-foreground"> — {h.description}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {product.audience && product.audience.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Who it&apos;s for</h2>
          <ul className="mt-4 list-inside list-disc space-y-1 text-muted-foreground">
            {product.audience.map((a: { label: string }, i: number) => (
              <li key={i}>{a.label}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {product.faq && product.faq.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {product.faq.map((f: { question: string; answer: string }, i: number) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <p className="font-medium">{f.question}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <Separator className="my-12" />

      {relatedPosts.length > 0 ? (
        <section>
          <h2 className="text-xl font-semibold">Related writing</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {relatedPosts.slice(0, 4).map((r: Record<string, unknown>) =>
              typeof r === "object" && r && "slug" in r ? (
                <PostCard
                  key={String(r.id)}
                  title={(r.title as string) || ""}
                  slug={r.slug as string}
                  excerpt={"excerpt" in r ? (r.excerpt as string) : null}
                  publishedAt={
                    "publishedAt" in r && r.publishedAt ? String(r.publishedAt) : undefined
                  }
                  readingTime={"readingTime" in r ? (r.readingTime as number) : null}
                  cover={
                    typeof r.coverImage === "object" && r.coverImage
                      ? (r.coverImage as { url?: string | null })
                      : null
                  }
                />
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {settings?.newsletterUrl ? (
        <NewsletterCTA
          className="mt-16"
          title={settings.newsletterTitle}
          description={settings.newsletterDescription}
          url={settings.newsletterUrl}
          buttonLabel={settings.newsletterButtonLabel}
        />
      ) : null}

      <p className="mt-10 text-sm">
        <Link href="/products" className="text-muted-foreground hover:text-foreground underline">
          ← All products
        </Link>
      </p>
    </div>
  );
}
