"use client";

import { useMemo } from "react";

import { useAuth } from "./useAuth";

export function useSellerGate() {
  const { marketplaceUser, loading } = useAuth();

  return useMemo(
    () => ({
      isSeller: marketplaceUser?.role === "seller",
      isVerified:
        marketplaceUser?.sellerProfile?.verificationStatus === "verified",
      status: marketplaceUser?.sellerProfile?.verificationStatus ?? "pending",
      loading,
    }),
    [marketplaceUser, loading]
  );
}
