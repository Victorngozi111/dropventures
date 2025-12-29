import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { getProducts } from "@/lib/products";
import { formatCurrency } from "@/utils/currency";

export async function ProductShowcase() {
  const products = await getProducts({ limit: 8 });

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)] md:text-3xl">
            Trending products
          </h2>
          <p className="text-base text-[color:var(--muted)]">
            Real-time CJ catalogue with DropVentures recommendations.
          </p>
        </div>
        <Button variant="outline" href="/collections/new-arrivals">
          See full catalogue
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="group flex flex-col overflow-hidden border-[color:var(--border)] hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-square overflow-hidden bg-[color:var(--surface-alt)]">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute left-3 top-3 flex flex-col gap-2">
                {product.shippingTimeInDays <= 7 && (
                  <Badge tone="accent" className="shadow-sm">Fast ship</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col space-y-3 p-5">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[color:var(--muted)] uppercase tracking-wide">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium text-[color:var(--warning)]">
                    <span></span>
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                </div>
                <Link href={`/product/${product.id}`} className="block text-base font-semibold text-[color:var(--foreground)] line-clamp-2 hover:text-[color:var(--primary)] transition-colors">
                  {product.title}
                </Link>
              </div>
              
              <div className="pt-2 border-t border-[color:var(--border)]/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-[color:var(--primary)]">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs text-[color:var(--muted)]">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <Button fullWidth variant="secondary" size="sm" href={`/product/${product.id}`}>
                  View details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
