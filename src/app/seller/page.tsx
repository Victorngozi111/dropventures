import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";

const benefits = [
  {
    title: "Sync CJ catalogue",
    details: "Access over 400,000 high-quality products with live stock updates and automated pricing suggestions.",
  },
  {
    title: "Automate fulfilment",
    details: "Connect logistics partners across Nigeria, Ghana, and Kenya with one-click order processing.",
  },
  {
    title: "Get paid faster",
    details: "Paystack handles your settlements with daily payouts and chargeback protection for verified sellers.",
  },
];

export default function SellerLandingPage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--background-strong)] px-8 py-14 text-center shadow-[0_50px_100px_-80px_rgba(37,99,235,0.6)]">
        <h1 className="text-4xl font-bold text-[color:var(--foreground)] md:text-5xl">
          Launch your African dropshipping empire
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-[color:var(--muted)]">
          DropVentures gives you CJdropshipping automation, Paystack payouts, and analytics built for African entrepreneurs.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button className="px-8 py-3 text-base" href="/seller/verify">
            Apply for seller verification
          </Button>
          <Button className="px-8 py-3 text-base" variant="secondary" href="/onboarding/role">
            Switch to seller
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="p-6">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{benefit.title}</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{benefit.details}</p>
          </Card>
        ))}
      </section>

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8">
        <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">
          Requirements for verification
        </h2>
        <ul className="mt-4 grid gap-4 text-sm text-[color:var(--foreground)] md:grid-cols-2">
          <li className="rounded-2xl bg-white px-5 py-4">✔ Corporate or personal identification</li>
          <li className="rounded-2xl bg-white px-5 py-4">✔ Paystack compliant business account</li>
          <li className="rounded-2xl bg-white px-5 py-4">✔ Accepted logistics coverage or CJ fulfilment plan</li>
          <li className="rounded-2xl bg-white px-5 py-4">✔ ₦2,000 onboarding fee</li>
          <li className="rounded-2xl bg-white px-5 py-4">✔ ₦1,000 monthly maintenance</li>
        </ul>
      </section>
    </div>
  );
}
