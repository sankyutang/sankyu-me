import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function PodcastCard({
  title,
  slug,
  excerpt,
  publishedAt,
  duration,
  cover,
  className,
}: {
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  duration?: string | null;
  cover?: { url?: string | null } | null;
  className?: string;
}) {
  const img = getMediaUrl(cover ?? null);
  const date =
    publishedAt != null
      ? new Date(publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  return (
    <Link href={`/podcast/${slug}`} className={cn("group block h-full", className)}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="bg-muted relative aspect-square w-full max-h-48 overflow-hidden sm:aspect-[16/9] sm:max-h-none">
          {img ? (
            <Image
              src={img}
              alt=""
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
              sizes="(max-width:768px) 100vw, 400px"
            />
          ) : null}
        </div>
        <CardHeader className="space-y-2">
          <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
            {date ? <span>{date}</span> : null}
            {duration ? <span>{duration}</span> : null}
          </div>
          <h3 className="text-lg font-semibold leading-snug tracking-tight group-hover:underline">
            {title}
          </h3>
        </CardHeader>
        {excerpt ? (
          <CardContent>
            <p className="text-muted-foreground line-clamp-2 text-sm">{excerpt}</p>
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}
