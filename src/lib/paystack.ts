"use client";

interface PaystackCheckoutOptions {
  email: string;
  amount: number;
  reference?: string;
  metadata?: Record<string, string>;
  onSuccess?: (reference: string) => void;
  onCancel?: () => void;
  publicKey?: string;
}

export function launchPaystackCheckout(options: PaystackCheckoutOptions) {
  const publicKey = options.publicKey ?? process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Paystack public key is missing");
    return;
  }

  // Lazy-load Paystack on the client to avoid SSR "window is not defined" errors.
  if (typeof window === "undefined") {
    return;
  }

  import("@paystack/inline-js")
    .then(({ default: PaystackPop }) => {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: publicKey,
        amount: options.amount,
        email: options.email,
        reference: options.reference,
        metadata: options.metadata,
        onSuccess: (response) => {
          options.onSuccess?.(response.reference);
        },
        onCancel: () => {
          options.onCancel?.();
        },
      });
    })
    .catch((error) => {
      console.error("Failed to load Paystack SDK", error);
    });
}
