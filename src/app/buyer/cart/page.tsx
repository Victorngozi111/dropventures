import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { mockProducts } from "@/data/mockData";
import { formatCurrency } from "@/utils/currency";

export default function CartPage() {
  const cartItems = mockProducts.slice(0, 2);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Shopping cart</h1>
        {cartItems.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{item.title}</h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{item.description}</p>
                <p className="mt-3 text-sm text-[color:var(--muted)]">
                  Ships in {item.shippingTimeInDays ?? 7} days from CJ warehouse
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xl font-bold text-[color:var(--primary)]">{formatCurrency(item.price)}</span>
                <Button variant="ghost">Remove</Button>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <aside className="space-y-4">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Order summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-[color:var(--muted)]">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-[color:var(--muted)]">Shipping</span>
            <span className="font-semibold">Calculated at checkout</span>
          </div>
          <div className="mt-4 h-[1px] w-full bg-[color:var(--border)]" />
          <div className="mt-4 flex items-center justify-between text-base">
            <span className="font-semibold text-[color:var(--foreground)]">Estimated total</span>
            <span className="text-xl font-bold text-[color:var(--primary)]">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <Button className="mt-6 w-full py-3" href="/buyer/checkout">
            Proceed to checkout
          </Button>
        </Card>
      </aside>
    </div>
  );
}
