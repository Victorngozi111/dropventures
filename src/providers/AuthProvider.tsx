"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  getMarketplaceUser,
  upsertMarketplaceUser,
  type MarketplaceUser,
  type UserRole,
} from "@/lib/firebase/users";

interface AuthContextValue {
  firebaseUser: User | null;
  marketplaceUser: MarketplaceUser | null;
  loading: boolean;
  setRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
  firebaseError: Error | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseInit = useMemo(() => {
    try {
      const auth = getFirebaseAuth();
      return { auth, error: null as Error | null };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.warn("Firebase authentication disabled:", err.message);
      return { auth: null, error: err };
    }
  }, []);

  const firebaseAuthInstance = firebaseInit.auth;
  const firebaseError = firebaseInit.error;

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [marketplaceUser, setMarketplaceUser] = useState<MarketplaceUser | null>(
    null
  );
  const [loading, setLoading] = useState(() => firebaseAuthInstance !== null);

  useEffect(() => {
    if (!firebaseAuthInstance) {
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setMarketplaceUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getMarketplaceUser(user.uid);

        if (profile) {
          setMarketplaceUser(profile);
        } else {
          const seededProfile: MarketplaceUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: "buyer",
          };

          await upsertMarketplaceUser(seededProfile);
          setMarketplaceUser(seededProfile);
        }
      } catch (error) {
        console.warn("Marketplace profile fetch failed", error);
        // Still allow the user session so sign-in is not blocked by Firestore rules.
        setMarketplaceUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: "buyer",
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseAuthInstance]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      marketplaceUser,
      loading,
      firebaseError,
      setRole: async (role: UserRole) => {
        if (!firebaseUser || firebaseError) return;

        const updated: MarketplaceUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role,
          sellerProfile:
            role === "seller"
              ? {
                  businessName: marketplaceUser?.sellerProfile?.businessName ?? "",
                  businessEmail: marketplaceUser?.sellerProfile?.businessEmail ?? firebaseUser.email ?? "",
                  verificationStatus:
                    marketplaceUser?.sellerProfile?.verificationStatus ?? "pending",
                }
              : undefined,
        };
        try {
          await upsertMarketplaceUser(updated);
          setMarketplaceUser((prev) => ({ ...updated, sellerProfile: updated.sellerProfile ?? prev?.sellerProfile }));
        } catch (error) {
          console.warn("Unable to update role", error);
        }
      },
      refreshProfile: async () => {
        if (!firebaseUser || firebaseError) return;
        try {
          const profile = await getMarketplaceUser(firebaseUser.uid);
          if (profile) {
            setMarketplaceUser(profile);
          }
        } catch (error) {
          console.warn("Unable to refresh profile", error);
        }
      },
    }),
    [firebaseUser, marketplaceUser, loading, firebaseError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
