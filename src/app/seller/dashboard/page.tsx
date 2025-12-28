import { redirect } from "next/navigation";

import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { formatCurrency } from "@/utils/currency";
import { mockProducts } from "@/data/mockData";

const metrics = [
  { label: "Monthly revenue", value: formatCurrency(450000) },
  { label: "Orders fulfilled", value: "128" },
  { label: "Average margin", value: "32%" },
];

export default function SellerDashboardPage() {
  // TODO: replace with server action session check
  if (process.env.NODE_ENV === "production") {
    redirect("/seller/verify");
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Seller HQ</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Monitor your storefront performance and manage CJ catalogue syncs.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6">
            <p className="text-sm text-[color:var(--muted)]">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">{metric.value}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Live catalog</h2>
          <Badge tone="accent">CJ Sync Active</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[color:var(--foreground)]">{product.title}</p>
                <span className="text-xs text-[color:var(--muted)]">{product.stock} units</span>
              </div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{product.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>{formatCurrency(product.price)}</span>
                <span className="text-xs text-[color:var(--muted)]">Updated 15 mins ago</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
