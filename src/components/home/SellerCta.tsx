import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";

const sellerPerks = [
  {
    title: "Instant CJ catalogue sync",
    description: "Import winning SKUs in minutes with automated margin suggestions",
  },
  {
    title: "Paystack payouts every 24h",
    description: "Verified sellers enjoy automated settlements and chargeback protection",
  },
  {
    title: "Powerful analytics dashboard",
    description: "Understand profit, conversion and fulfilment health at a glance",
  },
];

export function SellerCta() {
  return (
    <section className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-gradient-to-br from-[color:var(--primary)] via-[color:var(--primary-dark)] to-[color:var(--accent-dark)] px-6 py-12 text-white shadow-[0_80px_140px_-100px_rgba(16,185,129,0.8)] md:px-16 md:py-16">
      <div className="grid gap-10 md:grid-cols-[1fr,0.8fr] md:items-center">
        <div className="space-y-6">
          <Badge tone="neutral" className="bg-white/15 text-white">
            Sell on DropVentures
          </Badge>
          <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
            Pay ₦2,000 once to unlock your verified seller badge
          </h2>
          <p className="text-lg text-white/80">
            We manually review every seller. Once approved you get the full toolkit to launch and scale across Africa.
          </p>
          <div className="grid gap-4">
            {sellerPerks.map((perk) => (
              <div key={perk.title} className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                  {perk.title}
                </p>
                <p className="mt-1 text-base text-white/90">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6 rounded-3xl bg-white/10 p-8 backdrop-blur">
          <h3 className="text-2xl font-bold">Ready to activate?</h3>
          <p className="text-white/80">
            Complete payment with Paystack. We will verify your documents within 48 hours and unlock your seller dashboard.
          </p>
          <div className="space-y-3 text-sm text-white/80">
            <p>✔ One-time ₦2,000 onboarding fee</p>
            <p>✔ Access to seller HQ with ₦1,000 monthly maintenance</p>
            <p>✔ Priority support & logistics partners</p>
          </div>
          <Button
            className="w-full border border-white/40 bg-white/90 text-[color:var(--primary-dark)] hover:bg-white"
            href="/seller/verify"
          >
            Pay & become a seller
          </Button>
        </div>
      </div>
    </section>
  );
}
