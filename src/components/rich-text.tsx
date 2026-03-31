import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";

import { cn } from "@/lib/utils";

export function RichTextRenderer({
  data,
  className,
}: {
  data: SerializedEditorState | null | undefined;
  className?: string;
}) {
  if (!data) return null;
  return (
    <div className={cn("prose prose-neutral max-w-none dark:prose-invert", className)}>
      <RichText data={data} />
    </div>
  );
}
