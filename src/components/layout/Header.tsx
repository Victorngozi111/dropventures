"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingCart, Search, Home, Store, Wallet, X } from "lucide-react";

import { Button } from "@/components/shared/Button";
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
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--border)] bg-[color:var(--background-strong)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--border)] text-[color:var(--muted)] transition hover:bg-[color:var(--surface-alt)] md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--primary)] text-white shadow-sm">
              <span className="font-bold">DV</span>
            </div>
            <div className="hidden flex-col leading-none md:flex">
              <span className="text-lg font-bold tracking-tight text-[color:var(--foreground)]">DropVentures</span>
            </div>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-light)]" />
            <input
              className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-alt)] py-2 pl-10 pr-4 text-sm text-[color:var(--foreground)] outline-none transition-all focus:border-[color:var(--primary)] focus:bg-[color:var(--background-strong)] focus:ring-2 focus:ring-[color:var(--primary)]/20"
              placeholder="Search products, categories..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/buyer/cart">
            <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          {firebaseUser ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-[color:var(--foreground)]">
                  {firebaseUser.displayName || "User"}
                </p>
                <p className="text-xs text-[color:var(--muted)] capitalize">
                  {marketplaceUser?.role === "seller" ? "Seller Account" : "Buyer Account"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/account")}>
                Dashboard
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" href="/auth/sign-in">
                Log in
              </Button>
              <Button variant="primary" size="sm" href="/auth/sign-up">
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-[color:var(--border)] bg-[color:var(--background-strong)] px-4 py-4 md:hidden animate-in slide-in-from-top-2">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-light)]" />
            <input
              className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-alt)] py-2.5 pl-10 pr-4 text-sm outline-none"
              placeholder="Search..."
            />
          </div>
          
          <nav className="flex flex-col gap-1">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                      : "text-[color:var(--muted)] hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--foreground)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-[color:var(--border)] pt-4">
            {firebaseUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-[color:var(--primary)]/10 flex items-center justify-center text-[color:var(--primary)] font-bold">
                    {firebaseUser.displayName?.[0] || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{firebaseUser.displayName}</p>
                    <p className="text-xs text-[color:var(--muted)]">{firebaseUser.email}</p>
                  </div>
                </div>
                <Button fullWidth variant="outline" onClick={() => router.push("/account")}>
                  Dashboard
                </Button>
                <Button fullWidth variant="ghost" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" href="/auth/sign-in">Log in</Button>
                <Button variant="primary" href="/auth/sign-up">Sign up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
