import { SectionHeading } from "@/components/section-heading";
import { VideoCard } from "@/components/video-card";
import { getPayloadClient } from "@/lib/payload";

export default async function VideosPage() {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "videos",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 48,
    depth: 2,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title="视频" description="YouTube 与 Bilibili 上的长短视频。" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {res.docs.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">暂无视频。</p>
        ) : (
          res.docs.map((v) => (
            <VideoCard
              key={v.id}
              title={v.title}
              platform={v.platform}
              videoUrl={v.videoUrl}
              description={v.description}
              thumbnail={typeof v.thumbnail === "object" ? v.thumbnail : null}
              publishedAt={v.publishedAt || undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
