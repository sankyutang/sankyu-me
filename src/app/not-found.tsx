import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">404</h1>
      <p className="text-muted-foreground mt-4">This page doesn&apos;t exist.</p>
      <Link href="/" className="text-primary mt-8 inline-block underline">
        Back home
      </Link>
    </div>
  );
}
