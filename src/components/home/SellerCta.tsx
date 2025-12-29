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
    <section className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-gradient-to-br from-[color:var(--primary-dark)] to-[color:var(--primary)] px-6 py-12 text-white shadow-xl md:px-16 md:py-20">
      <div className="grid gap-12 md:grid-cols-[1fr,0.8fr] md:items-center">
        <div className="space-y-8">
          <Badge tone="neutral" className="bg-white/20 text-white border-transparent backdrop-blur-sm">
            Sell on DropVentures
          </Badge>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Start your dropshipping empire today
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            We manually review every seller. Once approved you get the full toolkit to launch and scale across Africa.
          </p>
          <div className="grid gap-4">
            {sellerPerks.map((perk) => (
              <div key={perk.title} className="rounded-2xl bg-white/10 p-5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-bold uppercase tracking-wider text-white/90">
                  {perk.title}
                </p>
                <p className="mt-1 text-base text-white/80">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8 rounded-3xl bg-white/10 p-8 border border-white/20 backdrop-blur-md shadow-2xl">
          <div>
            <h3 className="text-2xl font-bold">Ready to activate?</h3>
            <p className="mt-2 text-white/80">
              Complete payment with Paystack. We will verify your documents within 48 hours and unlock your seller dashboard.
            </p>
          </div>
          
          <div className="space-y-4 text-sm font-medium text-white/90">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20"></div>
              <p>One-time 2,000 onboarding fee</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20"></div>
              <p>Access to seller HQ with 1,000 monthly maintenance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20"></div>
              <p>Priority support & logistics partners</p>
            </div>
          </div>
          
          <Button
            size="lg"
            fullWidth
            className="bg-white text-[color:var(--primary-dark)] hover:bg-white/90 border-transparent shadow-lg"
            href="/seller/verify"
          >
            Pay & become a seller
          </Button>
        </div>
      </div>
    </section>
  );
}
