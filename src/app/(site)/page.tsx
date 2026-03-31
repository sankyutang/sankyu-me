import { HeroSection } from "@/components/hero-section";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { PodcastCard } from "@/components/podcast-card";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getPayloadClient } from "@/lib/payload";

export default async function HomePage() {
  const payload = await getPayloadClient();

  const [settings, posts, products, podcasts] = await Promise.all([
    payload.findGlobal({ slug: "site-settings" }).catch(() => null),
    payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 3,
      depth: 2,
    }),
    payload.find({
      collection: "products",
      where: {
        and: [{ status: { equals: "active" } }, { featured: { equals: true } }],
      },
      limit: 3,
      depth: 2,
    }),
    payload.find({
      collection: "podcasts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 2,
      depth: 2,
    }),
  ]);

  const heroTitle =
    settings?.heroTitle || "Build a one-person company with systems, AI, and leverage.";
  const heroSubtitle =
    settings?.heroSubtitle ||
    "I write about Notion systems, AI workflows, indie building, and creator business.";
  const primaryLabel = settings?.heroPrimaryCtaLabel || "Explore Products";
  const primaryHref = settings?.heroPrimaryCtaHref || "/products";
  const secondaryLabel = settings?.heroSecondaryCtaLabel || "Join Newsletter";
  const secondaryHref = settings?.heroSecondaryCtaHref || settings?.newsletterUrl || "/newsletter";

  return (
    <>
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        primaryLabel={primaryLabel}
        primaryHref={primaryHref}
        secondaryLabel={secondaryLabel}
        secondaryHref={secondaryHref}
      />

      <div className="container mx-auto max-w-6xl space-y-20 px-4 py-16">
        <section>
          <SectionHeading title="Featured products" description="Templates, tools, and digital goods." />
          <div className="grid gap-6 md:grid-cols-3">
            {products.docs.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-sm">No featured products yet.</p>
            ) : (
              products.docs.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  slug={p.slug}
                  summary={p.summary}
                  status={p.status}
                  productType={p.productType}
                  cover={typeof p.coverImage === "object" ? p.coverImage : null}
                  ctaText={p.ctaText}
                  externalUrl={p.externalUrl}
                />
              ))
            )}
          </div>
        </section>

        <section>
          <SectionHeading title="Latest writing" description="Recent posts from the blog." />
          <div className="grid gap-6 md:grid-cols-3">
            {posts.docs.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-sm">No posts yet.</p>
            ) : (
              posts.docs.map((post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  publishedAt={post.publishedAt || undefined}
                  readingTime={post.readingTime}
                  cover={typeof post.coverImage === "object" ? post.coverImage : null}
                  category={typeof post.category === "object" ? post.category : null}
                />
              ))
            )}
          </div>
        </section>

        <section>
          <SectionHeading title="Podcast" description="Latest episodes." />
          <div className="grid gap-6 md:grid-cols-2">
            {podcasts.docs.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-sm">No episodes yet.</p>
            ) : (
              podcasts.docs.map((ep) => (
                <PodcastCard
                  key={ep.id}
                  title={ep.title}
                  slug={ep.slug}
                  excerpt={ep.excerpt}
                  publishedAt={ep.publishedAt || undefined}
                  duration={ep.duration}
                  cover={typeof ep.coverImage === "object" ? ep.coverImage : null}
                />
              ))
            )}
          </div>
        </section>

        <NewsletterCTA
          title={settings?.newsletterTitle}
          description={settings?.newsletterDescription}
          url={settings?.newsletterUrl}
        />
      </div>
    </>
  );
}
