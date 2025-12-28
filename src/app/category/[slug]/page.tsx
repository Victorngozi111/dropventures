import { notFound } from "next/navigation";

import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { featuredCategories } from "@/data/mockData";
import { getProducts } from "@/lib/products";
import { formatCurrency } from "@/utils/currency";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = featuredCategories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const filteredProducts = await getProducts({ category: slug, limit: 30 });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Badge tone="accent" className="w-fit">
          {category.name}
        </Badge>
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{category.description}</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Curated products sourced via CJdropshipping with local pricing.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.length === 0 ? (
          <Card className="p-8">
            <p className="text-sm text-[color:var(--muted)]">
              We are syncing more products for this category. Check back soon.
            </p>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{product.title}</h2>
                  <span className="text-sm font-semibold text-[color:var(--primary)]">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <p className="text-sm text-[color:var(--muted)]">{product.description}</p>
                <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
                  <span>{product.seller.name}</span>
                  <span>⭐ {product.rating.toFixed(1)}</span>
                </div>
                <Button className="w-full" href={`/product/${product.id}`}>
                  View product
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
