import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  active: "Active",
  "coming-soon": "Coming soon",
  archived: "Archived",
};

export function ProductCard({
  name,
  slug,
  summary,
  status,
  productType,
  cover,
  ctaText,
  externalUrl,
  className,
}: {
  name: string;
  slug: string;
  summary?: string | null;
  status: string;
  productType: string;
  cover?: { url?: string | null } | null;
  ctaText?: string | null;
  externalUrl?: string | null;
  className?: string;
}) {
  const img = getMediaUrl(cover ?? null);
  return (
    <Card className={cn("flex h-full flex-col overflow-hidden", className)}>
      <div className="bg-muted relative aspect-[16/10] w-full">
        {img ? (
          <Image src={img} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : null}
      </div>
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{productType.replace(/-/g, " ")}</Badge>
          <Badge variant="secondary">{statusLabel[status] ?? status}</Badge>
        </div>
        <Link href={`/products/${slug}`} className="hover:underline">
          <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
        </Link>
      </CardHeader>
      {summary ? (
        <CardContent className="flex flex-1 flex-col gap-4">
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{summary}</p>
          <div className="mt-auto flex flex-wrap gap-2">
            <Link href={`/products/${slug}`} className={buttonVariants({ size: "sm" })}>
              View
            </Link>
            {externalUrl ? (
              <Link
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {ctaText || "External"}
              </Link>
            ) : null}
          </div>
        </CardContent>
      ) : (
        <CardContent className="mt-auto flex flex-wrap gap-2">
          <Link href={`/products/${slug}`} className={buttonVariants({ size: "sm" })}>
            View
          </Link>
          {externalUrl ? (
            <Link
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {ctaText || "External"}
            </Link>
          ) : null}
        </CardContent>
      )}
    </Card>
  );
}
