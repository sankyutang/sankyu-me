import Image from "next/image";
import Link from "next/link";

import { getMediaUrl } from "@/lib/media";
import { hostArrowLabel } from "@/lib/link-display";
import { cn } from "@/lib/utils";

export function WorkCard({
  title,
  slug,
  summary,
  cover,
  externalUrl,
  className,
}: {
  title: string;
  slug: string;
  summary?: string | null;
  cover?: { url?: string | null } | null;
  externalUrl?: string | null;
  className?: string;
}) {
  const img = getMediaUrl(cover ?? null);
  const detailHref = `/works/${slug}`;
  const ext = externalUrl?.trim();

  return (
    <article className={cn("flex h-full flex-col", className)}>
      <Link href={detailHref} className="bg-muted relative block aspect-[16/9] w-full overflow-hidden rounded-xl">
        {img ? (
          <Image src={img} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : null}
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <Link href={detailHref} className="group w-fit">
          <h3 className="text-foreground text-base font-semibold tracking-tight group-hover:underline">{title}</h3>
        </Link>
        {summary ? (
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{summary}</p>
        ) : null}
        <div className="text-foreground mt-auto flex flex-col gap-1 text-sm font-medium">
          <Link href={detailHref} className="w-fit hover:underline">
            查看 →
          </Link>
          {ext ? (
            <Link
              href={ext}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground w-fit hover:underline"
            >
              {hostArrowLabel(ext)}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
