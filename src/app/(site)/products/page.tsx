import Link from "next/link";
import type { Where } from "payload";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { getPayloadClient } from "@/lib/payload";

type SearchParams = Promise<{ status?: string; type?: string }>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const payload = await getPayloadClient();

  const statusFilter = sp.status as string | undefined;
  const typeFilter = sp.type as string | undefined;

  const clauses: Where[] = [];
  if (statusFilter && ["active", "coming-soon", "archived"].includes(statusFilter)) {
    clauses.push({ status: { equals: statusFilter } });
  }
  if (
    typeFilter &&
    ["notion-template", "digital-product", "software", "service", "other"].includes(typeFilter)
  ) {
    clauses.push({ productType: { equals: typeFilter } });
  }

  const where: Where | undefined = clauses.length > 0 ? { and: clauses } : undefined;

  const products = await payload.find({
    collection: "products",
    where,
    sort: "-updatedAt",
    limit: 48,
    depth: 2,
  });

  const statuses = [
    { value: "active", label: "Active" },
    { value: "coming-soon", label: "Coming soon" },
    { value: "archived", label: "Archived" },
  ];
  const types = [
    { value: "notion-template", label: "Notion" },
    { value: "digital-product", label: "Digital" },
    { value: "software", label: "Software" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title="Products" description="Notion templates, tools, and digital goods." />

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-muted-foreground text-sm">Status:</span>
        <Link href="/products">
          <Badge variant={!statusFilter ? "default" : "outline"}>All</Badge>
        </Link>
        {statuses.map((s) => (
          <Link key={s.value} href={`/products?status=${s.value}`}>
            <Badge variant={statusFilter === s.value ? "default" : "outline"}>{s.label}</Badge>
          </Link>
        ))}
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <span className="text-muted-foreground text-sm">Type:</span>
        <Link href="/products">
          <Badge variant={!typeFilter ? "secondary" : "outline"}>All</Badge>
        </Link>
        {types.map((t) => (
          <Link
            key={t.value}
            href={`/products?type=${t.value}${statusFilter ? `&status=${statusFilter}` : ""}`}
          >
            <Badge variant={typeFilter === t.value ? "secondary" : "outline"}>{t.label}</Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.docs.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">No products yet.</p>
        ) : (
          products.docs.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              slug={p.slug}
              summary={p.summary}
              status={p.status}
              productType={p.productType}
              cover={typeof p.coverImage === "object" ? p.coverImage : null}
              ctaText={p.ctaText}
              externalUrl={p.externalUrl}
            />
          ))
        )}
      </div>
    </div>
  );
}
