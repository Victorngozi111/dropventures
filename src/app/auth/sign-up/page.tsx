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
import { Input } from "@/components/shared/Input";
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
    <div className="relative mx-auto max-w-md py-12">
      {redirecting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[color:var(--background)]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" />
            <span className="text-sm font-semibold text-[color:var(--primary-dark)]">Creating your account...</span>
          </div>
        </div>
      )}
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)]">Create your account</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Join DropVentures to start buying or selling today.
        </p>
      </div>

      <Card className="p-6 md:p-8 shadow-xl border-[color:var(--border)]">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full name"
            placeholder="Jane Doe"
            error={errors.displayName?.message}
            {...register("displayName")}
          />

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder=""
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder=""
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {errorMessage}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
            Create account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[color:var(--muted)]">
          <span>Already have an account? </span>
          <Link className="font-semibold text-[color:var(--primary)] hover:underline" href={`/auth/sign-in?redirect=${encodeURIComponent(redirectTo)}`}>
            Sign in instead
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" /></div>}>
      <SignUpContent />
    </Suspense>
  );
}
