import { RichTextRenderer } from "@/components/rich-text";
import { getPublishedPageByType } from "@/lib/cms-page";

export default async function UsesPage() {
  const page = await getPublishedPageByType("uses");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">{page?.title || "Uses"}</h1>
      <p className="text-muted-foreground mt-2 text-sm">Tools, gear, and workflows.</p>
      {page?.content ? (
        <div className="mt-8">
          <RichTextRenderer data={page.content} />
        </div>
      ) : (
        <p className="text-muted-foreground mt-8 text-sm">
          Create a Page with type &quot;uses&quot; in the CMS.
        </p>
      )}
    </div>
  );
}
