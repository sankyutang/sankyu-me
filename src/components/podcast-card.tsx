import Image from "next/image";
import Link from "next/link";

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
    <article className={cn("flex h-full flex-col", className)}>
      <Link
        href={`/podcast/${slug}`}
        className="bg-muted relative block aspect-square w-full max-h-48 overflow-hidden rounded-xl sm:aspect-[16/9] sm:max-h-none"
      >
        {img ? (
          <Image
            src={img}
            alt=""
            fill
            className="object-cover transition-transform hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 400px"
          />
        ) : null}
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
          {date ? <span>{date}</span> : null}
          {duration ? <span>{duration}</span> : null}
        </div>
        <Link href={`/podcast/${slug}`} className="group">
          <h3 className="text-foreground text-base font-semibold leading-snug tracking-tight group-hover:underline">
            {title}
          </h3>
        </Link>
        {excerpt ? (
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{excerpt}</p>
        ) : null}
        <Link
          href={`/podcast/${slug}`}
          className="text-foreground mt-auto inline-flex text-sm font-medium hover:underline"
        >
          收听单集 →
        </Link>
      </div>
    </article>
  );
}
