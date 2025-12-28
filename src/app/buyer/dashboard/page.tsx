import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { getProducts } from "@/lib/products";
import { featuredCategories } from "@/data/mockData";
import { formatCurrency } from "@/utils/currency";

function categorySummary(products: Awaited<ReturnType<typeof getProducts>>) {
  const totals = new Map<string, number>();
  products.forEach((product) => {
    if (!product.category) return;
    const key = product.category.toLowerCase();
    totals.set(key, (totals.get(key) ?? 0) + 1);
  });
  return totals;
}

export default async function BuyerDashboardPage() {
  const products = await getProducts({ limit: 48, pages: 3 });
  const totals = categorySummary(products);
  const topPicks = products.slice(0, 12);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-3xl bg-[color:var(--surface)] p-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Badge tone="accent" className="w-fit">
            Buyer Home
          </Badge>
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Welcome back to DropVentures</h1>
          <p className="text-sm text-[color:var(--muted)]">
            Explore trending categories and ready-to-ship products synced from CJdropshipping.
          </p>
        </div>
        <div className="flex gap-3">
          <Button href="/categories">Browse categories</Button>
          <Button variant="secondary" href="/deals">
            View deals
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Categories</h2>
          <Button variant="ghost" href="/categories">
            See all
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredCategories.map((cat) => (
            <Card key={cat.slug} className="flex flex-col justify-between p-5">
              <div className="space-y-2">
                <Badge tone="primary" className="w-fit capitalize">
                  {cat.name}
                </Badge>
                <p className="text-sm text-[color:var(--muted)]">{cat.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[color:var(--muted)]">
                <span>{totals.get(cat.slug) ?? 0} products</span>
                <Button variant="secondary" href={`/category/${cat.slug}`}>
                  Shop
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Most bought</h2>
          <Badge tone="neutral">Live feed</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topPicks.map((product) => (
            <Card key={product.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)]">{product.title}</h3>
                <span className="text-sm font-semibold text-[color:var(--primary)]">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <p className="text-sm text-[color:var(--muted)] line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
                <span>{product.seller.name}</span>
                <span>⭐ {product.rating.toFixed(1)}</span>
              </div>
              <Button className="w-full" href={`/product/${product.id}`}>
                View product
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
