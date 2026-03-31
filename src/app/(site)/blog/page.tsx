import Link from "next/link";
import type { Where } from "payload";

import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { getPayloadClient } from "@/lib/payload";

type SearchParams = Promise<{ category?: string; tag?: string; page?: string }>;

export default async function BlogIndexPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1);
  const payload = await getPayloadClient();

  const categorySlug = sp.category;
  const tagSlug = sp.tag;

  let categoryId: string | number | undefined;
  let tagId: string | number | undefined;

  if (categorySlug) {
    const res = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      limit: 1,
    });
    categoryId = res.docs[0]?.id;
  }

  if (tagSlug) {
    const res = await payload.find({
      collection: "tags",
      where: { slug: { equals: tagSlug } },
      limit: 1,
    });
    tagId = res.docs[0]?.id;
  }

  const clauses: Where[] = [{ status: { equals: "published" } }];
  if (categoryId != null) {
    clauses.push({ category: { equals: categoryId } });
  }
  if (tagId != null) {
    clauses.push({ tags: { in: [tagId] } });
  }
  const where: Where = clauses.length > 1 ? { and: clauses } : clauses[0];

  const posts = await payload.find({
    collection: "posts",
    where,
    sort: "-publishedAt",
    limit: 12,
    page,
    depth: 2,
  });

  const [categories, tags] = await Promise.all([
    payload.find({ collection: "categories", limit: 100, sort: "name" }),
    payload.find({ collection: "tags", limit: 100, sort: "name" }),
  ]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="Blog"
        description="Writing on systems, AI, indie building, and products."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        <span className="text-muted-foreground text-sm">Categories:</span>
        <Link href="/blog">
          <Badge variant={!categorySlug ? "default" : "outline"}>All</Badge>
        </Link>
        {categories.docs.map((c) => (
          <Link key={c.id} href={`/blog?category=${c.slug}`}>
            <Badge variant={categorySlug === c.slug ? "default" : "outline"}>{c.name}</Badge>
          </Link>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <span className="text-muted-foreground text-sm">Tags:</span>
        <Link href="/blog">
          <Badge variant={!tagSlug ? "secondary" : "outline"}>All</Badge>
        </Link>
        {tags.docs.map((t) => (
          <Link key={t.id} href={`/blog?tag=${t.slug}`}>
            <Badge variant={tagSlug === t.slug ? "secondary" : "outline"}>{t.name}</Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.docs.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">No posts found.</p>
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

      {posts.totalPages > 1 ? (
        <div className="mt-10 flex justify-center gap-4 text-sm">
          {page > 1 ? (
            <Link
              href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ""}${tagSlug ? `&tag=${tagSlug}` : ""}`}
              className="underline"
            >
              Previous
            </Link>
          ) : null}
          <span className="text-muted-foreground">
            Page {page} of {posts.totalPages}
          </span>
          {page < posts.totalPages ? (
            <Link
              href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ""}${tagSlug ? `&tag=${tagSlug}` : ""}`}
              className="underline"
            >
              Next
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
