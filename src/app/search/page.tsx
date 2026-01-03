import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { getProducts } from "@/lib/products";
import { formatCurrency } from "@/utils/currency";

interface SearchPageProps {
  searchParams?: Promise<{ q?: string; maxPrice?: string; category?: string }>;
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, maxPrice, category } = (await searchParams) ?? {};
  const keyword = q?.trim() ?? "";
  const priceCap = maxPrice ? Number(maxPrice) : undefined;

  const products = await getProducts({
    keyword: keyword || undefined,
    category: category || undefined,
    maxPrice: Number.isFinite(priceCap) ? priceCap : undefined,
    limit: 30,
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Search products</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Live results from CJdropshipping. Add keywords, category, or a max price to refine.
        </p>
      </header>

      <form className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:grid-cols-3" method="get">
        <div className="sm:col-span-2">
          <input
            name="q"
            defaultValue={keyword}
            placeholder="Search products or SKUs (e.g. hoodie, CJLS1772421)"
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--input-bg)] px-4 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            name="maxPrice"
            min="0"
            step="1"
            defaultValue={maxPrice ?? ""}
            placeholder="Max price (USD)"
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--input-bg)] px-4 py-2.5 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
          />
          <Button type="submit" variant="accent" className="whitespace-nowrap">
            Search
          </Button>
        </div>
      </form>

      {products.length === 0 ? (
        <Card className="p-8">
          <p className="text-sm text-[color:var(--muted)]">No products found. Try another keyword or remove filters.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden border-[color:var(--border)]">
              <div className="relative h-48 w-full bg-[color:var(--surface-alt)]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute left-3 top-3 flex flex-col gap-2">
                  <Badge tone="accent" className="capitalize">{product.category}</Badge>
                  {(product.shippingTimeInDays ?? 999) <= 7 && <Badge tone="neutral">Fast ship</Badge>}
                </div>
              </div>
              <div className="space-y-3 p-5">
                <Link href={`/product/${product.id}`} className="block text-lg font-semibold text-[color:var(--foreground)] hover:text-[color:var(--primary)]">
                  {product.title}
                </Link>
                <p className="text-sm text-[color:var(--muted)] line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
                  <span>⭐ {product.rating.toFixed(1)}</span>
                  <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[color:var(--primary)]">{formatCurrency(product.price)}</span>
                  <Button size="sm" href={`/product/${product.id}`} variant="secondary">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
