export function getMediaUrl(media: { url?: string | null } | number | null | undefined): string | null {
  if (media == null || typeof media === "number") return null;
  return media.url ?? null;
}
