import Image from "next/image";

import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { heroHighlights } from "@/data/mockData";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-gradient-to-br from-[color:var(--background-strong)] to-[color:var(--surface)] px-6 py-12 shadow-[0_60px_120px_-80px_rgba(37,99,235,0.6)] md:px-16 md:py-16">
      <div className="grid gap-10 md:grid-cols-[1fr,0.6fr] md:items-center">
        <div className="space-y-6">
          <Badge tone="accent" className="w-fit">
            Powered by CJdropshipping
          </Badge>
          <h1 className="text-3xl font-extrabold leading-tight text-[color:var(--foreground)] md:text-5xl">
            Africa&#39;s modern dropshipping launchpad for bold entrepreneurs
          </h1>
          <p className="text-lg text-[color:var(--muted)] md:text-xl">
            Source global inventory in real-time, launch curated storefronts, and deliver delightful buyer experiences with Paystack-secured payouts.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="px-8 py-3 text-base" href="/seller">
              Become a seller
            </Button>
            <Button className="px-8 py-3 text-base" variant="secondary" href="/categories">
              Start shopping
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {heroHighlights.map((highlight) => (
              <div key={highlight.label} className="rounded-2xl border border-transparent bg-white/40 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-[color:var(--muted)] uppercase tracking-wide">
                  {highlight.label}
                </p>
                <p className="mt-2 text-sm text-[color:var(--foreground)]">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[320px] overflow-hidden rounded-3xl border border-[color:var(--border)] bg-white shadow-[0_30px_70px_-40px_rgba(16,185,129,0.8)] md:h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="DropVentures fulfilment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--primary)]/10 via-transparent to-[color:var(--accent)]/30" />
          <div className="absolute bottom-6 left-6 max-w-[260px] rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-semibold text-[color:var(--muted)] uppercase tracking-wide">
              Live inventory sync
            </p>
            <p className="mt-1 text-sm text-[color:var(--foreground)]">
              CJdropshipping products update every 30 minutes. Offer fresh catalogues without touching stock.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
