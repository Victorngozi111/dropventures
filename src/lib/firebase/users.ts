"use client";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { getFirebaseDb } from "./client";

export type UserRole = "buyer" | "seller";

export interface SellerProfile {
  businessName: string;
  businessEmail: string;
  paystackReference?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MarketplaceUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  sellerProfile?: SellerProfile;
}

const COLLECTION = "users";

export async function getMarketplaceUser(uid: string): Promise<MarketplaceUser | null> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid,
    email: data.email ?? null,
    displayName: data.displayName ?? null,
    role: (data.role ?? "buyer") as UserRole,
    sellerProfile: data.sellerProfile
      ? {
          ...data.sellerProfile,
          createdAt: data.sellerProfile.createdAt?.toDate?.() ?? undefined,
          updatedAt: data.sellerProfile.updatedAt?.toDate?.() ?? undefined,
        }
      : undefined,
  } satisfies MarketplaceUser;
}

export async function upsertMarketplaceUser(user: MarketplaceUser): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, user.uid);

  await setDoc(
    ref,
    {
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      sellerProfile: user.sellerProfile
        ? {
            ...user.sellerProfile,
            createdAt: user.sellerProfile.createdAt ?? serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        : undefined,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateSellerVerification(
  uid: string,
  updates: Partial<SellerProfile>
): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, COLLECTION, uid);

  await updateDoc(ref, {
    "sellerProfile": {
      ...updates,
      updatedAt: serverTimestamp(),
    },
  });
}
