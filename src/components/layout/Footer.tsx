import Link from "next/link";

const footerSections = [
  {
    title: "Marketplace",
    links: [
      { label: "All Categories", href: "/categories" },
      { label: "Buyer Protection", href: "/policies/buyer-protection" },
      { label: "How Dropshipping Works", href: "/guides/dropshipping" },
      { label: "Track Your Order", href: "/orders/track" },
    ],
  },
  {
    title: "Sell on DropVentures",
    links: [
      { label: "Seller Pricing", href: "/seller/pricing" },
      { label: "Onboarding Guide", href: "/seller/onboarding" },
      { label: "Paystack Payouts", href: "/seller/payouts" },
      { label: "Supplier Integrations", href: "/seller/integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About DropVentures", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/support" },
      { label: "Payment Options", href: "/support/payments" },
      { label: "Shipping & Logistics", href: "/support/shipping" },
      { label: "Return Policy", href: "/support/returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--background-strong)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">
              {section.title}
            </h3>
            <ul className="space-y-3 text-sm text-[color:var(--foreground)]">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link className="transition hover:text-[color:var(--primary)]" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} DropVentures. Built for African entrepreneurs.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/cookies">Cookies</Link>
            <Link href="/support/security">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
