"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/hooks/useAuth";

export default function AccountPage() {
  const { firebaseUser, marketplaceUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace("/auth/sign-in?redirect=/account");
    }
  }, [firebaseUser, loading, router]);

  if (!firebaseUser) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm text-[color:var(--muted)]">Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Account overview</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Manage your role, storefront, and buyer preferences.
        </p>
      </header>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Profile</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">Name</p>
            <p className="text-lg text-[color:var(--foreground)]">
              {firebaseUser.displayName ?? "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">Email</p>
            <p className="text-lg text-[color:var(--foreground)]">{firebaseUser.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">Role</p>
            <div className="mt-1">
              <Badge tone={marketplaceUser?.role === "seller" ? "accent" : "primary"}>
                {marketplaceUser?.role ?? "buyer"}
              </Badge>
            </div>
          </div>
          {marketplaceUser?.sellerProfile && (
            <div>
              <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">Seller status</p>
              <p className="text-lg capitalize text-[color:var(--foreground)]">
                {marketplaceUser.sellerProfile.verificationStatus}
              </p>
              {marketplaceUser.sellerProfile.paystackReference && (
                <p className="text-xs text-[color:var(--muted)]">
                  Paystack ref: {marketplaceUser.sellerProfile.paystackReference}
                </p>
              )}
            </div>
          )}
        </div>
        {marketplaceUser?.role === "seller" ? (
          <Button className="mt-6" href="/seller/dashboard">
            Go to Seller HQ
          </Button>
        ) : (
          <Button className="mt-6" href="/onboarding/role">
            Switch to seller
          </Button>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Buyer Preferences</h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Coming soon: set saved addresses, payment methods, and notifications.
        </p>
        <Button className="mt-4" variant="secondary" href="/buyer/cart">
          View cart
        </Button>
      </Card>
    </div>
  );
}
