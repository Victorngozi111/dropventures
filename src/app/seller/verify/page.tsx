"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useAuth } from "@/hooks/useAuth";
import { launchPaystackCheckout } from "@/lib/paystack";
import { upsertMarketplaceUser } from "@/lib/firebase/users";

const schema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessEmail: z.string().email("Enter a valid business email"),
});

type SellerVerifyValues = z.infer<typeof schema>;

export default function SellerVerifyPage() {
  const { firebaseUser, marketplaceUser, refreshProfile } = useAuth();
  const router = useRouter();
  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerVerifyValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: marketplaceUser?.sellerProfile?.businessName ?? "",
      businessEmail: marketplaceUser?.sellerProfile?.businessEmail ?? firebaseUser?.email ?? "",
    },
  });

  const onSubmit = async (values: SellerVerifyValues) => {
    if (!firebaseUser) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      await launchPaystackCheckout({
        email: values.businessEmail,
        amount: 2000 * 100, // convert to kobo
        metadata: {
          userId: firebaseUser.uid,
          businessName: values.businessName,
        },
        onSuccess: async (reference) => {
          try {
            await upsertMarketplaceUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: "seller",
              sellerProfile: {
                businessName: values.businessName,
                businessEmail: values.businessEmail,
                paystackReference: reference,
                verificationStatus: "pending",
              },
            });
            await refreshProfile();
            setStatusMessage("Payment received! Our team will verify you within 48 hours.");
            router.push("/seller/dashboard");
          } catch (error) {
            console.error(error);
            setStatusMessage("We received your payment but could not update your profile. Contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setIsProcessing(false);
          setStatusMessage("Payment was cancelled. You can try again when ready.");
        },
      });
    } catch (error) {
      console.error(error);
      setStatusMessage("Unable to start Paystack checkout. Please reload and try again.");
      setIsProcessing(false);
    }
  };

  const hasPaid =
    marketplaceUser?.sellerProfile?.verificationStatus === "pending" &&
    Boolean(marketplaceUser?.sellerProfile?.paystackReference);

  const paystackUnavailable = !paystackKey;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card className="p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Verify as a seller</h1>
          <p className="text-sm text-[color:var(--muted)]">
            Pay a one-time ₦2,000 onboarding fee to unlock seller tools. We will review your submission manually. After activation, a ₦1,000 maintenance fee renews monthly.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--muted)]" htmlFor="businessName">
              Registered business or brand name
            </label>
            <input
              id="businessName"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="DropVentures Clothing"
              {...register("businessName")}
            />
            {errors.businessName && <p className="text-sm text-red-500">{errors.businessName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--muted)]" htmlFor="businessEmail">
              Business email for Paystack receipt
            </label>
            <input
              id="businessEmail"
              type="email"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="support@yourbrand.africa"
              {...register("businessEmail")}
            />
            {errors.businessEmail && <p className="text-sm text-red-500">{errors.businessEmail.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full py-3"
            loading={isProcessing}
            disabled={hasPaid || paystackUnavailable}
          >
            {hasPaid
              ? "Awaiting verification"
              : paystackUnavailable
              ? "Paystack key missing"
              : "Pay ₦2,000 via Paystack"}
          </Button>
        </form>
        {statusMessage && <p className="mt-4 text-sm text-[color:var(--muted)]">{statusMessage}</p>}
        {paystackUnavailable && (
          <p className="mt-3 text-sm text-red-500">Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in Vercel to enable checkout.</p>
        )}
      </Card>
    </div>
  );
}
