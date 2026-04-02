import Link from "next/link";

import { NewsletterCTA } from "@/components/newsletter-cta";
import { RichTextRenderer } from "@/components/rich-text";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getPublishedPageByType } from "@/lib/cms-page";
import { getPayloadClient } from "@/lib/payload";

export default async function AboutPage() {
  const page = await getPublishedPageByType("about");
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "site-settings" }).catch(() => null);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">{page?.title || "About"}</h1>
      {page?.content ? (
        <div className="mt-8">
          <RichTextRenderer data={page.content} />
        </div>
      ) : (
        <p className="text-muted-foreground mt-8 text-sm leading-relaxed">
          Add an About page in the CMS (Pages → page type &quot;about&quot;).
        </p>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/products" className={buttonVariants()}>
          View products
        </Link>
        {settings?.newsletterUrl ? (
          <Link
            href={settings.newsletterUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Subscribe to newsletter
          </Link>
        ) : null}
      </div>

      {settings?.newsletterUrl ? (
        <NewsletterCTA
          className="mt-16"
          title={settings.newsletterTitle}
          description={settings.newsletterDescription}
          url={settings.newsletterUrl}
          buttonLabel={settings.newsletterButtonLabel}
        />
      ) : null}
    </div>
  );
}
