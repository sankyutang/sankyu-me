import { RichTextRenderer } from "@/components/rich-text";
import { getPublishedPageByType } from "@/lib/cms-page";

export default async function LinksPage() {
  const page = await getPublishedPageByType("links");

  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{page?.title || "Links"}</h1>
      {page?.content ? (
        <div className="mt-8">
          <RichTextRenderer data={page.content} />
        </div>
      ) : (
        <p className="text-muted-foreground mt-8 text-sm">
          Create a Page with type &quot;links&quot; in the CMS.
        </p>
      )}
    </div>
  );
}
