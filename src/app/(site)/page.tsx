import { HomeContentTabs } from "@/components/home-content-tabs";
import { HomeIntro } from "@/components/home-intro";
import { HomeTopSocial } from "@/components/home-top-social";
import { NewsletterCTA } from "@/components/newsletter-cta";
import { PodcastCard } from "@/components/podcast-card";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { VideoCard } from "@/components/video-card";
import { WorkCard } from "@/components/work-card";
import { getPayloadClient } from "@/lib/payload";

const HOME_LIMIT = 9;

export default async function HomePage() {
  const payload = await getPayloadClient();

  const [settings, posts, products, podcasts, works, videos] = await Promise.all([
    payload.findGlobal({ slug: "site-settings" }).catch(() => null),
    payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: HOME_LIMIT,
      depth: 2,
    }),
    payload.find({
      collection: "products",
      where: { status: { equals: "active" } },
      sort: "-updatedAt",
      limit: HOME_LIMIT,
      depth: 2,
    }),
    payload.find({
      collection: "podcasts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: HOME_LIMIT,
      depth: 2,
    }),
    payload.find({
      collection: "works",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: HOME_LIMIT,
      depth: 2,
    }),
    payload.find({
      collection: "videos",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: HOME_LIMIT,
      depth: 2,
    }),
  ]);

  const headline =
    settings?.introHeadline?.trim() ||
    settings?.heroTitle ||
    "Build a one-person company with systems, AI, and leverage.";
  const body =
    settings?.introBody?.trim() ||
    settings?.heroSubtitle ||
    "I write about Notion systems, AI workflows, indie building, and creator business.";
  const logo =
    typeof settings?.introAvatar === "object" && settings?.introAvatar ? settings.introAvatar : null;
  const nameHighlight = settings?.introNameHighlight?.trim() || null;
  const ctaLabel = settings?.heroPrimaryCtaLabel?.trim() || null;
  const ctaHref = settings?.heroPrimaryCtaHref?.trim() || null;

  const socialLinks =
    settings?.socialLinks?.filter((s: { url?: string | null }) => Boolean(s.url?.trim())) ?? [];

  const emptyHint = (label: string) => (
    <p className="text-muted-foreground text-sm">{label}</p>
  );

  const panels = {
    blog:
      posts.docs.length === 0 ? (
        emptyHint("暂无文章。")
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.docs.map((post) => (
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
          ))}
        </div>
      ),
    products:
      products.docs.length === 0 ? (
        emptyHint("暂无产品。")
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.docs.map((p) => (
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
          ))}
        </div>
      ),
    works:
      works.docs.length === 0 ? (
        emptyHint("暂无作品。")
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {works.docs.map((w) => (
            <WorkCard
              key={w.id}
              title={w.title}
              slug={w.slug}
              summary={w.summary}
              cover={typeof w.coverImage === "object" ? w.coverImage : null}
              externalUrl={w.externalUrl}
            />
          ))}
        </div>
      ),
    podcasts:
      podcasts.docs.length === 0 ? (
        emptyHint("暂无播客单集。")
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {podcasts.docs.map((ep) => (
            <PodcastCard
              key={ep.id}
              title={ep.title}
              slug={ep.slug}
              excerpt={ep.excerpt}
              publishedAt={ep.publishedAt || undefined}
              duration={ep.duration}
              cover={typeof ep.coverImage === "object" ? ep.coverImage : null}
            />
          ))}
        </div>
      ),
    videos:
      videos.docs.length === 0 ? (
        emptyHint("暂无视频条目。")
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {videos.docs.map((v) => (
            <VideoCard
              key={v.id}
              title={v.title}
              platform={v.platform}
              videoUrl={v.videoUrl}
              description={v.description}
              thumbnail={typeof v.thumbnail === "object" ? v.thumbnail : null}
              publishedAt={v.publishedAt || undefined}
            />
          ))}
        </div>
      ),
  };

  const moreHref = {
    blog: "/blog",
    products: "/products",
    works: "/works",
    podcasts: "/podcast",
    videos: "/videos",
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-2 text-left md:px-[60px]">
      <HomeTopSocial links={socialLinks} />

      <HomeIntro
        headline={headline}
        body={body}
        logo={logo}
        nameHighlight={nameHighlight}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />

      <div className="pt-2">
        <HomeContentTabs panels={panels} moreHref={moreHref} defaultTab="blog" />

        {settings?.newsletterUrl ? (
          <NewsletterCTA
            className="mt-24"
            title={settings.newsletterTitle}
            description={settings.newsletterDescription}
            url={settings.newsletterUrl}
            buttonLabel={settings.newsletterButtonLabel}
            avatar={logo}
            sponsorLabel={settings.newsletterSponsorLabel}
            sponsorUrl={settings.newsletterSponsorUrl}
          />
        ) : null}
      </div>
    </div>
  );
}
