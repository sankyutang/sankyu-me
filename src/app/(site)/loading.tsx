export default function SiteLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <div className="bg-muted h-10 w-48 animate-pulse rounded-lg" />
      <div className="bg-muted mt-6 h-4 w-full max-w-xl animate-pulse rounded" />
      <div className="bg-muted mt-4 h-4 w-full max-w-lg animate-pulse rounded" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
