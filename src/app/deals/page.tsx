import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { getProducts } from "@/lib/products";
import { formatCurrency } from "@/utils/currency";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const products = await getProducts({ limit: 12 });
  const deals = products.map((product, index) => ({
    ...product,
    discount: 10 + (index % 4) * 5,
  }));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Badge tone="warning" className="w-fit">
          Limited Time
        </Badge>
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Daily deals & flash sales</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Fresh offers every day. Save big on curated CJdropshipping products.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {deals.map((deal) => (
          <Card key={deal.id} className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{deal.title}</h2>
                <Badge tone="accent">-{deal.discount}%</Badge>
              </div>
              <p className="text-sm text-[color:var(--muted)]">{deal.description}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[color:var(--primary)]">
                  {formatCurrency(Math.round(deal.price * (1 - deal.discount / 100)))}
                </span>
                <span className="text-sm text-[color:var(--muted)] line-through">
                  {formatCurrency(deal.price)}
                </span>
              </div>
              <Button href={`/product/${deal.id}`}>Grab deal</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
