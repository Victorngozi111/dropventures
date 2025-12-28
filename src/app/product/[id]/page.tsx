import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { getProductById } from "@/lib/products";
import { formatCurrency } from "@/utils/currency";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
      <Card className="overflow-hidden">
        <div className="relative h-[420px]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </Card>
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge tone="primary" className="w-fit capitalize">
            {product.category}
          </Badge>
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">{product.title}</h1>
          <p className="text-sm text-[color:var(--muted)]">{product.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold text-[color:var(--primary)]">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm font-semibold text-[color:var(--muted)]">
              ⭐ {product.rating.toFixed(1)} • Ships in {product.shippingTimeInDays ?? 7} days
            </span>
          </div>
        </div>
        <Card className="space-y-4 p-6">
          <div>
            <p className="text-sm text-[color:var(--muted)]">Sold by</p>
            <p className="text-lg font-semibold text-[color:var(--foreground)]">{product.seller.name}</p>
            <p className="text-sm text-[color:var(--muted)]">{product.seller.location}</p>
          </div>
          <Button className="w-full py-3" href="/buyer/cart">
            Add to cart
          </Button>
          <Button className="w-full py-3" variant="secondary" href="/buyer/checkout">
            Buy now with Paystack
          </Button>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Fulfilment & shipping</h2>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
            <li>✔ CJdropshipping warehouse handling</li>
            <li>✔ Quality control before dispatch</li>
            <li>✔ Tracking updates via DropVentures dashboard</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
