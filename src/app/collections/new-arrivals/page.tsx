import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { getProducts } from "@/lib/products";
import { formatCurrency } from "@/utils/currency";

export const dynamic = "force-dynamic";

export default async function NewArrivalsPage() {
  const arrivals = await getProducts({ limit: 12 });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">New arrivals</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Fresh products from CJdropshipping just landed on DropVentures.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {arrivals.map((product) => (
          <Card key={product.id} className="p-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{product.title}</h2>
              <p className="text-sm text-[color:var(--muted)]">{product.description}</p>
              <span className="text-xl font-bold text-[color:var(--primary)]">
                {formatCurrency(product.price)}
              </span>
              <Button href={`/product/${product.id}`}>View product</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
