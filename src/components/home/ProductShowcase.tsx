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
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--foreground)] md:text-3xl">
            Trending products for African shoppers
          </h2>
          <p className="text-sm text-[color:var(--muted)]">
            Real-time CJ catalogue with DropVentures recommendations.
          </p>
        </div>
        <Button variant="secondary" href="/collections/new-arrivals">
          See full catalogue
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <Badge tone="accent">Fast ship</Badge>
                <Badge tone="primary">{product.category}</Badge>
              </div>
            </div>
            <div className="space-y-3 px-5 py-6">
              <Link href={`/product/${product.id}`} className="block text-lg font-semibold text-[color:var(--foreground)]">
                {product.title}
              </Link>
              <p className="text-sm text-[color:var(--muted)]">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[color:var(--primary)]">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
                  {product.stock} in stock
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
                <span>Seller: {product.seller.name}</span>
                <span>⭐ {product.rating.toFixed(1)}</span>
              </div>
              <Button className="w-full" href={`/product/${product.id}`}>
                View details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
