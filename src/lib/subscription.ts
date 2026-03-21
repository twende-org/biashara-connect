import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type PlanTier = "free" | "basic" | "business" | "enterprise";
export type SubscriptionStatus = "active" | "pending" | "expired" | "cancelled";

export interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  paymentMethod?: string;
  paymentReference?: string;
  amount: number;
  createdAt?: any;
  updatedAt?: any;
  confirmedBy?: string;
  confirmedAt?: any;
}

export const PLAN_LIMITS: Record<PlanTier, { maxShops: number; maxProducts: number; maxStaff: number; price: number }> = {
  free: { maxShops: 1, maxProducts: 20, maxStaff: 1, price: 0 },
  basic: { maxShops: 1, maxProducts: 50, maxStaff: 3, price: 9900 },
  business: { maxShops: 5, maxProducts: 999999, maxStaff: 10, price: 29900 },
  enterprise: { maxShops: 999999, maxProducts: 999999, maxStaff: 999999, price: 79900 },
};

function getDb() {
  if (!db) throw new Error("Firebase not configured");
  return db;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const snap = await getDoc(doc(getDb(), "subscriptions", userId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Subscription;
}

export async function createSubscription(userId: string, data: Omit<Subscription, "id">): Promise<void> {
  await setDoc(doc(getDb(), "subscriptions", userId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateSubscription(userId: string, data: Partial<Subscription>): Promise<void> {
  await updateDoc(doc(getDb(), "subscriptions", userId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function confirmSubscription(userId: string, adminId: string): Promise<void> {
  await updateDoc(doc(getDb(), "subscriptions", userId), {
    status: "active",
    confirmedBy: adminId,
    confirmedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const snap = await getDocs(collection(getDb(), "subscriptions"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscription));
}

export async function getAllUsers(): Promise<Array<{ id: string; email: string; displayName: string; createdAt?: any }>> {
  const snap = await getDocs(collection(getDb(), "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

/** Check if user is a system admin (stored in admins collection) */
export async function isSystemAdmin(userId: string): Promise<boolean> {
  const snap = await getDoc(doc(getDb(), "admins", userId));
  return snap.exists();
}

export async function setSystemAdmin(userId: string, email: string): Promise<void> {
  await setDoc(doc(getDb(), "admins", userId), { email, createdAt: serverTimestamp() });
}
