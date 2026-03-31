import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function HeroSection({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  className,
}: {
  title: string;
  subtitle?: string | null;
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
  className?: string;
}) {
  return (
    <section className={cn("border-border/80 relative overflow-hidden border-b", className)}>
      <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em]">
              sankyu.me
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
            {subtitle ? (
              <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">{subtitle}</p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              {primaryHref && primaryLabel ? (
                <Link href={primaryHref} className={buttonVariants({ size: "lg" })}>
                  {primaryLabel}
                </Link>
              ) : null}
              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
          <div className="border-border bg-card/50 relative rounded-2xl border p-6 shadow-sm backdrop-blur-sm md:p-8">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Systems, AI workflows, and indie building — a calm, high-signal home for long-form writing
              and products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
