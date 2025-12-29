import Image from "next/image";

import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { heroHighlights } from "@/data/mockData";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-gradient-to-br from-[color:var(--surface)] to-[color:var(--surface-alt)] px-6 py-12 shadow-sm md:px-16 md:py-20">
      <div className="grid gap-12 md:grid-cols-[1fr,0.8fr] md:items-center">
        <div className="space-y-8">
          <Badge tone="accent" className="w-fit">
            Powered by CJdropshipping
          </Badge>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[color:var(--foreground)] md:text-6xl">
            Africa&#39;s modern dropshipping launchpad
          </h1>
          <p className="text-lg text-[color:var(--muted)] md:text-xl leading-relaxed">
            Source global inventory in real-time, launch curated storefronts, and deliver delightful buyer experiences with Paystack-secured payouts.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" href="/seller">
              Become a seller
            </Button>
            <Button size="lg" variant="outline" href="/categories">
              Start shopping
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 pt-4">
            {heroHighlights.map((highlight) => (
              <div key={highlight.label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--background-strong)]/50 p-4 backdrop-blur-sm">
                <p className="text-xs font-bold text-[color:var(--primary)] uppercase tracking-wider">
                  {highlight.label}
                </p>
                <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[320px] overflow-hidden rounded-3xl border border-[color:var(--border)] bg-white shadow-2xl md:h-[500px] rotate-1 hover:rotate-0 transition-transform duration-500">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="DropVentures fulfilment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-bold text-[color:var(--muted)] uppercase tracking-wide">
                Live inventory sync
              </p>
            </div>
            <p className="text-sm font-medium text-[color:var(--foreground)]">
              CJdropshipping products update every 30 minutes. Offer fresh catalogues without touching stock.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
