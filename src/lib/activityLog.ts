import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { db } from "./firebase";
import type { AppRole } from "@/types";

function getDb(): Firestore {
  if (!db) throw new Error("Firebase haijasanidiwa.");
  return db;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: AppRole | null;
  shopId: string;
  action: string;
  category: "sale" | "product" | "expense" | "supplier" | "shop" | "user" | "auth";
  details: string;
  metadata?: Record<string, any>;
  createdAt: any;
}

/**
 * Log a user activity to Firestore.
 * Silently fails to avoid blocking main operations.
 */
export async function logActivity(params: {
  userId: string;
  userEmail: string;
  userName: string;
  role: AppRole | null;
  shopId: string;
  action: string;
  category: ActivityLog["category"];
  details: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    await addDoc(collection(getDb(), "activity_logs"), {
      ...params,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Activity log failed:", err);
  }
}

/**
 * Get activity logs for a shop, ordered by most recent first.
 */
export async function getActivityLogs(
  shopId: string,
  maxResults = 50
): Promise<ActivityLog[]> {
  const q = query(
    collection(getDb(), "activity_logs"),
    where("shopId", "==", shopId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
}

/**
 * Get activity logs for a specific user.
 */
export async function getUserActivityLogs(
  userId: string,
  maxResults = 50
): Promise<ActivityLog[]> {
  const q = query(
    collection(getDb(), "activity_logs"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
}
