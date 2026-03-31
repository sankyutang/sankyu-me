import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <Link href={`/blog/${slug}`} className={cn("group block h-full", className)}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden">
          {img ? (
            <Image
              src={img}
              alt=""
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          ) : null}
        </div>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {category?.name ? <Badge variant="secondary">{category.name}</Badge> : null}
            {date ? <span>{date}</span> : null}
            {readingTime != null ? <span>{readingTime} min read</span> : null}
          </div>
          <h3 className="text-lg font-semibold leading-snug tracking-tight group-hover:underline">
            {title}
          </h3>
        </CardHeader>
        {excerpt ? (
          <CardContent>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{excerpt}</p>
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}
