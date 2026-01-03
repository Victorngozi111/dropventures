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

type PaystackTransactionOptions = {
  key: string;
  amount: number;
  email: string;
  currency: string;
  reference?: string;
  metadata?: Record<string, string>;
  onSuccess: (response: { reference: string }) => void;
  onCancel: () => void;
};

type PaystackPopInstance = {
  newTransaction(options: PaystackTransactionOptions): void;
};

type PaystackPopConstructor = new () => PaystackPopInstance;

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

  // Helper to open checkout using either module import or global script.
  const openCheckout = (PaystackPop: PaystackPopConstructor) => {
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: publicKey,
      amount: options.amount,
      email: options.email,
      currency: options.currency ?? "NGN",
      reference: options.reference,
      metadata: options.metadata,
      onSuccess: (response: { reference: string }) => {
        options.onSuccess?.(response.reference);
      },
      onCancel: () => {
        options.onCancel?.();
      },
    });
  };

  try {
    const { default: PaystackPop } = await import("@paystack/inline-js");
    openCheckout(PaystackPop);
    return;
  } catch (error) {
    console.warn("Paystack inline-js import failed, falling back to CDN", error);
  }

  // Fallback: load CDN script and use window.PaystackPop
  const loadScript = () =>
    new Promise<void>((resolve, reject) => {
      const existing = document.querySelector("script[data-paystack-cdn]") as HTMLScriptElement | null;
      if (existing && existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      const script = existing ?? document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.dataset.paystackCdn = "true";
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load Paystack CDN script"));
      if (!existing) document.body.appendChild(script);
    });

  await loadScript();
  const win = window as unknown as { PaystackPop?: PaystackPopConstructor };
  if (!win.PaystackPop) {
    throw new Error("Paystack SDK unavailable after CDN load");
  }
  openCheckout(win.PaystackPop);
}
