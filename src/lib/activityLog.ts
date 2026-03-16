import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
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
 * Get activity logs for a shop — no composite index needed.
 * Sorts client-side by createdAt descending.
 */
export async function getActivityLogs(
  shopId: string,
  maxResults = 50
): Promise<ActivityLog[]> {
  const q = query(
    collection(getDb(), "activity_logs"),
    where("shopId", "==", shopId)
  );
  const snap = await getDocs(q);
  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
  // Sort client-side (newest first)
  logs.sort((a, b) => {
    const ta = a.createdAt?.seconds || 0;
    const tb = b.createdAt?.seconds || 0;
    return tb - ta;
  });
  return logs.slice(0, maxResults);
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
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
  logs.sort((a, b) => {
    const ta = a.createdAt?.seconds || 0;
    const tb = b.createdAt?.seconds || 0;
    return tb - ta;
  });
  return logs.slice(0, maxResults);
}
