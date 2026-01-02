"use client";

interface PaystackCheckoutOptions {
  email: string;
  amount: number;
  reference?: string;
  metadata?: Record<string, string>;
  onSuccess?: (reference: string) => void;
  onCancel?: () => void;
  publicKey?: string;
  currency?: string; // default NGN
}

export async function launchPaystackCheckout(options: PaystackCheckoutOptions): Promise<void> {
  const publicKey = options.publicKey ?? process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Paystack public key is missing");
    throw new Error("Paystack public key is missing");
  }

  if (!options.email) {
    throw new Error("Paystack email is required");
  }

  if (!Number.isFinite(options.amount) || options.amount <= 0) {
    throw new Error("Paystack amount must be a positive number (in kobo)");
  }

  // Lazy-load Paystack on the client to avoid SSR "window is not defined" errors.
  if (typeof window === "undefined") {
    throw new Error("Paystack can only run in the browser");
  }

  try {
    const { default: PaystackPop } = await import("@paystack/inline-js");
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: publicKey,
      amount: options.amount,
      email: options.email,
      currency: options.currency ?? "NGN",
      reference: options.reference,
      metadata: options.metadata,
      onSuccess: (response) => {
        options.onSuccess?.(response.reference);
      },
      onCancel: () => {
        options.onCancel?.();
      },
    });
  } catch (error) {
    console.error("Failed to load Paystack SDK", error);
    throw error instanceof Error ? error : new Error("Failed to load Paystack SDK");
  }
}
