import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { formatCurrency } from "@/utils/currency";

export default function CheckoutPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
      <section className="space-y-6">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Checkout</h1>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Shipping details</h2>
          <form className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="Full name"
            />
            <input
              className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="Phone number"
            />
            <input
              className="md:col-span-2 rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="Delivery address"
            />
            <Button className="md:col-span-2 py-3" type="button">
              Save shipping info
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Payment</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            All payments are securely processed by Paystack. You will be redirected to complete your payment.
          </p>
          <Button className="mt-6 w-full py-3" type="button">
            Pay with Paystack
          </Button>
        </Card>
      </section>

      <aside>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[color:var(--foreground)]">{formatCurrency(157000)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>₦2,500 (Lagos standard)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>VAT</span>
              <span>₦7,850</span>
            </div>
          </div>
          <div className="mt-4 h-[1px] bg-[color:var(--border)]" />
          <div className="mt-4 flex items-center justify-between text-base font-semibold text-[color:var(--foreground)]">
            <span>Total</span>
            <span className="text-xl text-[color:var(--primary)]">{formatCurrency(167350)}</span>
          </div>
        </Card>
      </aside>
    </div>
  );
}
