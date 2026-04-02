import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogTOC } from "@/components/blog-toc";
import { JsonLd } from "@/components/json-ld";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { PostCard } from "@/components/post-card";
import { RichTextRenderer } from "@/components/rich-text";
import { Badge } from "@/components/ui/badge";
import { getMediaUrl } from "@/lib/media";
import { getPayloadClient } from "@/lib/payload";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  const post = res.docs[0];
  if (!post || post.status !== "published") {
    return {};
  }
  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const og =
    getMediaUrl(typeof post.ogImage === "object" ? post.ogImage : null) ||
    getMediaUrl(typeof post.coverImage === "object" ? post.coverImage : null);

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    alternates: { canonical: post.canonicalUrl || `${base}/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      url: `${base}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: (post.updatedAtCustom as string | undefined) || post.updatedAt || undefined,
      images: og ? [{ url: og }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      images: og ? [og] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const res = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  const post = res.docs[0];
  if (!post || post.status !== "published") {
    notFound();
  }

  const settings = await payload.findGlobal({ slug: "site-settings" }).catch(() => null);

  const related =
    post.relatedPosts && Array.isArray(post.relatedPosts) && post.relatedPosts.length > 0
      ? post.relatedPosts
          .filter((r): r is NonNullable<typeof r> => typeof r === "object" && r !== null)
          .slice(0, 3)
      : [];

  const cover = getMediaUrl(typeof post.coverImage === "object" ? post.coverImage : null);
  const og =
    getMediaUrl(typeof post.ogImage === "object" ? post.ogImage : null) || cover;
  const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  const date =
    post.publishedAt != null
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAtCustom || post.updatedAt,
    author: { "@type": "Person", name: settings?.siteName || "Sankyu" },
    image: og ? [og] : undefined,
    mainEntityOfPage: `${base}/blog/${post.slug}`,
  };

  return (
    <article className="container mx-auto max-w-5xl px-4 py-12">
      <JsonLd data={jsonLd} />
      <header className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {typeof post.category === "object" && post.category?.name ? (
            <Badge variant="secondary">{post.category.name}</Badge>
          ) : null}
          {date ? <time dateTime={post.publishedAt || undefined}>{date}</time> : null}
          {post.readingTime != null ? <span>{post.readingTime} min read</span> : null}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>
        {post.excerpt ? <p className="text-muted-foreground text-lg leading-relaxed">{post.excerpt}</p> : null}
      </header>

      {cover ? (
        <div className="bg-muted relative mx-auto mt-10 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl">
          <Image src={cover} alt="" fill className="object-cover" priority sizes="(max-width:768px) 100vw, 768px" />
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div id="article-body" className="mx-auto w-full max-w-3xl">
          <RichTextRenderer data={post.content} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <BlogTOC />
          </div>
        </aside>
      </div>

      {post.newsletterCTAEnabled && settings?.newsletterUrl ? (
        <NewsletterCTA
          className="mx-auto mt-16 max-w-3xl"
          title={settings.newsletterTitle}
          description={settings.newsletterDescription}
          url={settings.newsletterUrl}
          buttonLabel={settings.newsletterButtonLabel}
        />
      ) : null}

      {related.length > 0 ? (
        <section className="mx-auto mt-20 max-w-5xl border-t pt-12">
          <h2 className="mb-6 text-xl font-semibold">Related</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) =>
              "slug" in r && "title" in r ? (
                <PostCard
                  key={String(r.id)}
                  title={r.title as string}
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
                  category={
                    typeof r.category === "object" && r.category
                      ? (r.category as { name?: string | null })
                      : null
                  }
                />
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <div className="mx-auto mt-12 flex max-w-3xl justify-between text-sm">
        <Link href="/blog" className="text-muted-foreground hover:text-foreground underline">
          ← All posts
        </Link>
      </div>
    </article>
  );
}
