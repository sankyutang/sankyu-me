import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button-variants";
import { getPayloadClient } from "@/lib/payload";
import { cn } from "@/lib/utils";

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ go?: string }>;
}) {
  const sp = await searchParams;
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "site-settings" }).catch(() => null);
  const url = settings?.newsletterUrl;

  if (sp.go === "1" && url) {
    redirect(url);
  }

  return (
    <div className="container mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">
        {settings?.newsletterTitle || "Newsletter"}
      </h1>
      <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
        {settings?.newsletterDescription ||
          "Deep dives on systems, AI workflows, and building in public — delivered to your inbox."}
      </p>
      {url ? (
        <Link
          href={url}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ size: "lg" }), "mt-8")}
        >
          Subscribe on Substack
        </Link>
      ) : (
        <p className="text-muted-foreground mt-8 text-sm">
          Set <code className="text-foreground">newsletterUrl</code> in Site settings.
        </p>
      )}
      <p className="text-muted-foreground mt-6 text-xs">
        Tip: use <Link href="/newsletter?go=1">/newsletter?go=1</Link> to redirect when URL is configured.
      </p>
    </div>
  );
}
