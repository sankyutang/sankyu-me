import Image from "next/image";
import Link from "next/link";

import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

function HeadlineWithHighlight({
  text,
  highlight,
}: {
  text: string;
  highlight?: string | null;
}) {
  const h = highlight?.trim();
  if (!h) return <>{text}</>;
  const i = text.indexOf(h);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-foreground font-medium">{h}</span>
      {text.slice(i + h.length)}
    </>
  );
}

export function HomeIntro({
  headline,
  body,
  logo,
  nameHighlight,
  ctaLabel,
  ctaHref,
  className,
}: {
  headline: string;
  body?: string | null;
  logo?: { url?: string | null } | null;
  nameHighlight?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  className?: string;
}) {
  const img = getMediaUrl(logo ?? null);
  const label = ctaLabel?.trim() || "联系我 ↗";
  const href = ctaHref?.trim();

  return (
    <section className={cn("py-10 md:py-12", className)}>
      <div className="flex max-w-3xl flex-col items-start gap-5 text-left">
        {img ? (
          <div className="relative size-[34px] shrink-0 overflow-hidden rounded-md">
            <Image src={img} alt="" fill className="object-contain" sizes="34px" priority />
          </div>
        ) : null}
        <h1 className="text-muted-foreground w-full text-base font-medium leading-7">
          <span className="block">
            <HeadlineWithHighlight text={headline} highlight={nameHighlight} />
          </span>
          {body ? <span className="mt-3 block">{body}</span> : null}
          {href ? (
            <span className="mt-3 block">
              <Link
                href={href}
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                {label}
              </Link>
            </span>
          ) : null}
        </h1>
      </div>
    </section>
  );
}
