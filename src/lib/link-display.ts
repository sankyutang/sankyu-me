/** Label like `example.com →` for outbound links (Alyssa-style). */
export function hostArrowLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.host.replace(/^www\./, "");
    return `${host} →`;
  } catch {
    return "打开 →";
  }
}
