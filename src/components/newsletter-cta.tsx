import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function NewsletterCTA({
  title,
  description,
  url,
  className,
}: {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  className?: string;
}) {
  if (!url) return null;
  return (
    <section
      className={cn(
        "border-border bg-muted/40 rounded-2xl border p-8 md:p-10",
        className,
      )}
    >
      <div className="mx-auto max-w-xl text-center">
        <h3 className="text-xl font-semibold tracking-tight">{title || "Newsletter"}</h3>
        {description ? (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
        ) : null}
        <Link
          href={url}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ size: "lg" }), "mt-6")}
        >
          Subscribe
        </Link>
      </div>
    </section>
  );
}
