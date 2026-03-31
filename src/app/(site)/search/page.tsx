import Link from "next/link";

import { PodcastCard } from "@/components/podcast-card";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { getPayloadClient } from "@/lib/payload";

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";

  const payload = await getPayloadClient();

  if (q.length < 2) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <SectionHeading title="Search" description="Search titles across posts, products, podcasts, and pages." />
        <form action="/search" method="GET" className="mt-6 flex flex-wrap gap-2">
          <Input name="q" defaultValue={q} placeholder="Type at least 2 characters…" className="max-w-md" />
          <button type="submit" className="text-primary text-sm font-medium underline">
            Search
          </button>
        </form>
        {q.length > 0 ? (
          <p className="text-muted-foreground mt-6 text-sm">Enter at least 2 characters.</p>
        ) : null}
      </div>
    );
  }

  const [pr, pd, pc, pg] = await Promise.all([
    payload.find({
      collection: "posts",
      where: {
        and: [{ status: { equals: "published" } }, { title: { contains: q } }],
      },
      limit: 20,
      depth: 2,
    }),
    payload.find({
      collection: "products",
      where: { name: { contains: q } },
      limit: 20,
      depth: 2,
    }),
    payload.find({
      collection: "podcasts",
      where: {
        and: [{ status: { equals: "published" } }, { title: { contains: q } }],
      },
      limit: 20,
      depth: 2,
    }),
    payload.find({
      collection: "pages",
      where: {
        and: [{ status: { equals: "published" } }, { title: { contains: q } }],
      },
      limit: 20,
      depth: 1,
    }),
  ]);

  const posts = pr.docs;
  const products = pd.docs;
  const podcasts = pc.docs;
  const pages = pg.docs;
  const total = posts.length + products.length + podcasts.length + pages.length;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <SectionHeading title="Search" description="Search titles across the site." />

      <form action="/search" method="GET" className="mt-6 flex flex-wrap gap-2">
        <Input name="q" defaultValue={q} placeholder="Search…" className="max-w-md" />
        <button type="submit" className="text-primary text-sm font-medium underline">
          Search
        </button>
      </form>

      <p className="text-muted-foreground mt-6 text-sm">
        {total === 0 ? "No results." : `${total} result(s) for “${q}”.`}
      </p>

      {posts.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Posts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
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
        </section>
      ) : null}

      {products.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Products</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((p) => (
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
        </section>
      ) : null}

      {podcasts.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Podcast</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {podcasts.map((ep) => (
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
        </section>
      ) : null}

      {pages.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Pages</h2>
          <ul className="space-y-2">
            {pages.map((p) => (
              <li key={p.id}>
                <Link href={`/${p.slug}`} className="underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
