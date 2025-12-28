"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { getFirebaseAuth } from "@/lib/firebase/client";

const schema = z
  .object({
    displayName: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof schema>;

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const redirectTo = searchParams.get("redirect") ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    setErrorMessage(null);

    try {
      const auth = getFirebaseAuth();
      const credentials = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(credentials.user, { displayName: values.displayName });
      setRedirecting(true);
      router.replace(`/onboarding/role?redirect=${encodeURIComponent(redirectTo)}`);
    } catch (error) {
      console.error(error);
      const code = (error as { code?: string })?.code ?? "";
      const messageMap: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered. Try signing in instead.",
        "auth/invalid-email": "That email address looks invalid. Please check and try again.",
        "auth/weak-password": "Password is too weak. Please use at least 6 characters.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
      };
      setErrorMessage(messageMap[code] ?? "Unable to create your account right now. Please try again.");
      setRedirecting(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-lg">
      {redirecting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[color:var(--background)]/80 backdrop-blur">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" aria-label="Redirecting" />
          <span className="ml-3 text-sm font-semibold text-[color:var(--primary-dark)]">Creating your account…</span>
        </div>
      )}
      <Card className="p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Create your DropVentures account</h1>
          <p className="text-sm text-[color:var(--muted)]">
            You will choose to continue as a buyer or seller after creating your account.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--muted)]" htmlFor="displayName">
              Full name
            </label>
            <input
              id="displayName"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="Jane Doe"
              {...register("displayName")}
            />
            {errors.displayName && <p className="text-sm text-red-500">{errors.displayName.message}</p>}
          </div>

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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--muted)]" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="••••••••"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

          <Button type="submit" className="w-full py-3" loading={isSubmitting}>
            Create account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[color:var(--muted)]">
          <span>Already have an account? </span>
          <Link className="font-semibold text-[color:var(--primary)]" href={`/auth/sign-in?redirect=${encodeURIComponent(redirectTo)}`}>
            Sign in instead
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-[color:var(--muted)]">Loading…</div>}>
      <SignUpContent />
    </Suspense>
  );
}
