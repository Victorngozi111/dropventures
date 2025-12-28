"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useAuth } from "@/hooks/useAuth";

const roleCards = [
  {
    role: "buyer" as const,
    title: "Buyer",
    description: "Discover unique products from vetted African sellers and global suppliers.",
    perks: ["Secure checkout", "Paystack protection", "Fast shipping"],
    cta: "Continue as buyer",
  },
  {
    role: "seller" as const,
    title: "Seller",
    description: "Import CJ catalogue, automate fulfilment, and get paid with Paystack.",
    perks: ["Seller HQ dashboard", "CJ catalogue sync", "Paystack payouts"],
    cta: "Apply as seller",
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";
  const { firebaseUser, setRole, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = async (role: "buyer" | "seller") => {
    if (!firebaseUser || loading) return;

    setSubmitting(true);
    setError(null);

    try {
      await setRole(role);
      if (role === "seller") {
        router.replace("/seller/verify");
      } else {
        router.replace(redirectTo);
      }
    } catch (err) {
      console.error(err);
      setError("We could not update your profile right now. Try again shortly.");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!firebaseUser && !loading) {
      router.replace(`/auth/sign-in?redirect=${encodeURIComponent("/onboarding/role")}`);
    }
  }, [firebaseUser, loading, router]);

  if (!firebaseUser) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm text-[color:var(--muted)]">Preparing your account...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Choose how you&#39;ll use DropVentures</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Don&#39;t worry, you can switch roles later from your account settings.
        </p>
      </div>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {roleCards.map((card) => (
          <Card key={card.role} className="flex h-full flex-col justify-between p-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">{card.title}</h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{card.description}</p>
              </div>
              <ul className="space-y-3 text-sm text-[color:var(--foreground)]">
                {card.perks.map((perk) => (
                  <li key={perk} className="rounded-2xl bg-[color:var(--surface)] px-4 py-3">
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              className="mt-6 w-full py-3"
              variant={card.role === "seller" ? "accent" : "primary"}
              loading={submitting}
              onClick={() => handleRoleSelect(card.role)}
            >
              {card.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
