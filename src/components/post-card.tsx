import Image from "next/image";
import Link from "next/link";

import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

type PostCardProps = {
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  readingTime?: number | null;
  cover?: { url?: string | null } | null;
  category?: { name?: string | null } | null;
  className?: string;
};

export function PostCard({
  title,
  slug,
  excerpt,
  publishedAt,
  readingTime,
  cover,
  category,
  className,
}: PostCardProps) {
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
        href={`/blog/${slug}`}
        className="bg-muted relative block aspect-[16/9] w-full overflow-hidden rounded-xl"
      >
        {img ? (
          <Image
            src={img}
            alt=""
            fill
            className="object-cover transition-transform hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : null}
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="text-muted-foreground flex flex-wrap gap-x-2 gap-y-1 text-xs">
          {category?.name ? <span>{category.name}</span> : null}
          {date ? <span>{date}</span> : null}
          {readingTime != null ? <span>{readingTime} min read</span> : null}
        </div>
        <Link href={`/blog/${slug}`} className="group">
          <h3 className="text-foreground text-base font-semibold leading-snug tracking-tight group-hover:underline">
            {title}
          </h3>
        </Link>
        {excerpt ? (
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{excerpt}</p>
        ) : null}
        <Link
          href={`/blog/${slug}`}
          className="text-foreground mt-auto inline-flex text-sm font-medium hover:underline"
        >
          阅读全文 →
        </Link>
      </div>
    </article>
  );
}
