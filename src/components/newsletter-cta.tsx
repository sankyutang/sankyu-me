import Image from "next/image";
import Link from "next/link";

import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function NewsletterCTA({
  title,
  description,
  url,
  buttonLabel,
  avatar,
  sponsorLabel,
  sponsorUrl,
  className,
}: {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  buttonLabel?: string | null;
  avatar?: { url?: string | null } | null;
  sponsorLabel?: string | null;
  sponsorUrl?: string | null;
  className?: string;
}) {
  if (!url) return null;
  const img = getMediaUrl(avatar ?? null);
  const sponsor = sponsorUrl?.trim();
  const sponsorL = sponsorLabel?.trim();

  return (
    <section className={cn("mt-20 text-left", className)}>
      <div className="mx-auto flex max-w-xl flex-col items-start gap-6">
        {img ? (
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
            <Image src={img} alt="" fill className="object-cover" sizes="40px" />
          </div>
        ) : null}
        <div className="text-muted-foreground space-y-1 text-sm leading-relaxed">
          {title ? <p className="text-foreground font-medium">{title}</p> : null}
          {description ? <p>{description}</p> : null}
          {sponsor && sponsorL ? (
            <p>
              <Link href={sponsor} target="_blank" rel="noreferrer" className="text-foreground font-medium underline-offset-4 hover:underline">
                {sponsorL}
              </Link>
            </p>
          ) : null}
        </div>
        <Link
          href={url}
          target="_blank"
          rel="noreferrer"
          className="bg-foreground text-background hover:bg-foreground/90 inline-flex rounded-full px-8 py-2.5 text-sm font-medium transition-colors"
        >
          {buttonLabel?.trim() || "Subscribe"}
        </Link>
      </div>
    </section>
  );
}
