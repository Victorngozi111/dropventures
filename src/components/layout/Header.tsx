"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingCart, User, Search, Home, Store, Wallet } from "lucide-react";

import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

const primaryNav = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/categories", icon: Store },
  { label: "Deals", href: "/deals", icon: Wallet },
  { label: "Sell on DropVentures", href: "/seller", icon: Store },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { firebaseUser, marketplaceUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--background-strong)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background-strong)]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted)] md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] font-semibold text-white shadow-lg">
              DV
            </span>
            <div className="hidden flex-col leading-none md:flex">
              <span className="text-lg font-bold text-[color:var(--foreground)]">DropVentures</span>
              <span className="text-xs font-medium text-[color:var(--muted)]">Africa&#39;s Dropshipping Superstore</span>
            </div>
          </Link>
        </div>

        <form className="hidden flex-1 items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-2 shadow-sm md:flex">
          <Search className="h-4 w-4 text-[color:var(--muted)]" />
          <input
            className="flex-1 bg-transparent text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)]"
            placeholder="Search for anything - products, suppliers, categories"
            name="search"
          />
          <Badge tone="accent" className="hidden md:inline-flex">
            CJ Synced
          </Badge>
        </form>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/buyer/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted)] transition hover:text-[color:var(--primary)]"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {firebaseUser ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex flex-col text-xs text-[color:var(--muted)]">
                <span className="font-semibold text-[color:var(--foreground)]">{firebaseUser.displayName ?? firebaseUser.email}</span>
                <span className="capitalize">
                  {marketplaceUser?.role === "seller"
                    ? marketplaceUser.sellerProfile?.verificationStatus === "verified"
                      ? "Verified Seller"
                      : "Seller Pending"
                    : "Buyer"}
                </span>
              </div>
              <Button variant="secondary" onClick={() => router.push("/account")}>Account</Button>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
                <Button href="/auth/sign-in">Sign in</Button>
                <Button variant="accent" href="/auth/sign-up">
                  Create free account
                </Button>
            </div>
          )}

          <Link
            href={firebaseUser ? "/account" : "/auth/sign-in"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted)] transition hover:text-[color:var(--primary)] md:hidden"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-[color:var(--border)] bg-[color:var(--background-strong)] px-4 py-4 md:hidden">
          <form className="mb-4 flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-2 shadow-sm">
            <Search className="h-4 w-4 text-[color:var(--muted)]" />
            <input
              className="flex-1 bg-transparent text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)]"
              placeholder="Search DropVentures"
              name="mobile-search"
            />
          </form>
          <div className="flex flex-col gap-2">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "border-[color:var(--primary)] bg-[color:var(--surface-alt)] text-[color:var(--primary-dark)]"
                      : "border-[color:var(--border)] text-[color:var(--muted)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {firebaseUser ? (
              <Button variant="ghost" onClick={handleSignOut}>
                Sign out
              </Button>
            ) : (
              <>
                <Button href="/auth/sign-in">Sign in</Button>
                <Button variant="accent" href="/auth/sign-up">
                  Open free account
                </Button>
              </>
            )}
          </div>
        </nav>
      )}

      <nav className="border-t border-[color:var(--border)] bg-[color:var(--background-strong)] py-2 shadow-sm">
        <div className="mx-auto hidden max-w-7xl items-center justify-between px-4 md:flex">
          <div className="flex items-center gap-6 text-sm font-semibold text-[color:var(--muted)]">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 transition ${
                    isActive
                      ? "bg-[color:var(--surface-alt)] text-[color:var(--primary-dark)]"
                      : "hover:bg-[color:var(--surface)] hover:text-[color:var(--primary)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Badge tone="neutral">Free nationwide shipping over ₦50k</Badge>
        </div>
      </nav>
    </header>
  );
}
