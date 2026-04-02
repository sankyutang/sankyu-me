import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import { getPayloadClient } from "@/lib/payload";

export default async function WorksPage() {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "works",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 48,
    depth: 2,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title="作品" description="项目、案例与创作。" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {res.docs.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">暂无作品。</p>
        ) : (
          res.docs.map((w) => (
            <WorkCard
              key={w.id}
              title={w.title}
              slug={w.slug}
              summary={w.summary}
              cover={typeof w.coverImage === "object" ? w.coverImage : null}
              externalUrl={w.externalUrl}
            />
          ))
        )}
      </div>
    </div>
  );
}
