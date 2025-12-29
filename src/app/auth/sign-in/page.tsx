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
import { Input } from "@/components/shared/Input";
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
    <div className="relative mx-auto max-w-md py-12">
      {redirecting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[color:var(--background)]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" />
            <span className="text-sm font-semibold text-[color:var(--primary-dark)]">Signing you in...</span>
          </div>
        </div>
      )}
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)]">Welcome back</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Sign in to continue shopping or managing your store.
        </p>
      </div>

      <Card className="p-6 md:p-8 shadow-xl border-[color:var(--border)]">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder=""
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="text-right">
              <Link href="/auth/reset-password" className="text-xs font-medium text-[color:var(--primary)] hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {errorMessage}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={isSubmitting || loading}>
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[color:var(--muted)]">
          <span>New to DropVentures? </span>
          <Link className="font-semibold text-[color:var(--primary)] hover:underline" href={`/auth/sign-up?redirect=${encodeURIComponent(redirectTo)}`}>
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" /></div>}>
      <SignInContent />
    </Suspense>
  );
}
