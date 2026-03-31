import { PodcastCard } from "@/components/podcast-card";
import { SectionHeading } from "@/components/section-heading";
import { getPayloadClient } from "@/lib/payload";

export default async function PodcastIndexPage() {
  const payload = await getPayloadClient();
  const episodes = await payload.find({
    collection: "podcasts",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 48,
    depth: 2,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title="Podcast" description="Episodes and show notes." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {episodes.docs.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">No episodes yet.</p>
        ) : (
          episodes.docs.map((ep) => (
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
    </div>
  );
}
