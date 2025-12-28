"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { useAuth } from "@/hooks/useAuth";
import { getFirebaseAuth } from "@/lib/firebase/client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInValues = z.infer<typeof schema>;

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const redirectTo = searchParams.get("redirect") ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    setErrorMessage(null);

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, values.email, values.password);
      setRedirecting(true);
      router.replace(redirectTo);
    } catch (error) {
      console.error(error);
      const code = (error as { code?: string })?.code ?? "";
      const messageMap: Record<string, string> = {
        "auth/invalid-credential": "Invalid email or password. Please try again.",
        "auth/user-not-found": "No account found for this email. Please sign up first.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/too-many-requests": "Too many attempts. Please wait a moment and retry.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
      };
      setErrorMessage(messageMap[code] ?? "Unable to sign you in. Please check your details or try again later.");
      setRedirecting(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-lg">
      {redirecting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[color:var(--background)]/80 backdrop-blur">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" aria-label="Redirecting" />
          <span className="ml-3 text-sm font-semibold text-[color:var(--primary-dark)]">Signing you in…</span>
        </div>
      )}
      <Card className="p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Welcome back</h1>
          <p className="text-sm text-[color:var(--muted)]">
            Sign in to continue shopping or managing your DropVentures store.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--muted)]" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--muted)]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

          <Button type="submit" className="w-full py-3" loading={isSubmitting || loading}>
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[color:var(--muted)]">
          <span>New to DropVentures? </span>
          <Link className="font-semibold text-[color:var(--primary)]" href={`/auth/sign-up?redirect=${encodeURIComponent(redirectTo)}`}>
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-[color:var(--muted)]">Loading…</div>}>
      <SignInContent />
    </Suspense>
  );
}
