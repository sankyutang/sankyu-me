import Image from "next/image";
import Link from "next/link";

import { getMediaUrl } from "@/lib/media";
import { hostArrowLabel } from "@/lib/link-display";
import { cn } from "@/lib/utils";

const platformLabel: Record<string, string> = {
  youtube: "YouTube",
  bilibili: "Bilibili",
};

export function VideoCard({
  title,
  platform,
  videoUrl,
  description,
  thumbnail,
  publishedAt,
  className,
}: {
  title: string;
  platform: string;
  videoUrl: string;
  description?: string | null;
  thumbnail?: { url?: string | null } | null;
  publishedAt?: string | null;
  className?: string;
}) {
  const img = getMediaUrl(thumbnail ?? null);
  const date =
    publishedAt != null
      ? new Date(publishedAt).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  return (
    <article className={cn("flex h-full flex-col", className)}>
      <Link
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        className="bg-muted relative block aspect-video w-full overflow-hidden rounded-xl"
      >
        {img ? (
          <Image src={img} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : null}
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
          <span>{platformLabel[platform] ?? platform}</span>
          {date ? <span>{date}</span> : null}
        </div>
        <h3 className="text-foreground text-base font-semibold leading-snug tracking-tight">{title}</h3>
        {description ? (
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{description}</p>
        ) : null}
        <Link
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-foreground mt-auto inline-flex text-sm font-medium hover:underline"
        >
          {hostArrowLabel(videoUrl)}
        </Link>
      </div>
    </article>
  );
}
