"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Check } from "lucide-react";

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

function RoleSelectionContent() {
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" />
          <p className="text-sm text-[color:var(--muted)]">Preparing your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] md:text-4xl">Choose how you&#39;ll use DropVentures</h1>
        <p className="mt-4 text-base text-[color:var(--muted)]">
          Don&#39;t worry, you can switch roles later from your account settings.
        </p>
      </div>
      
      {error && (
        <div className="mx-auto max-w-md rounded-xl bg-red-50 p-4 text-center text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}
      
      <div className="grid gap-8 md:grid-cols-2">
        {roleCards.map((card) => (
          <Card key={card.role} className="flex h-full flex-col justify-between p-8 border-[color:var(--border)] hover:border-[color:var(--primary)]/30 transition-all hover:shadow-lg">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--foreground)]">{card.title}</h2>
                <p className="mt-2 text-base text-[color:var(--muted)] leading-relaxed">{card.description}</p>
              </div>
              <ul className="space-y-3">
                {card.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3 text-sm text-[color:var(--foreground)]">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                      <Check className="h-3 w-3" />
                    </div>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              className="mt-8 w-full"
              size="lg"
              variant={card.role === "seller" ? "primary" : "outline"}
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

export default function RoleSelectionPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" /></div>}>
      <RoleSelectionContent />
    </Suspense>
  );
}
