import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  setDoc,
  runTransaction,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Shop, Product, Sale, Supplier, Expense, DailySalesSummary } from "@/types";

// ---- Users / Profiles ----
export async function createUserProfile(uid: string, data: { email: string; displayName: string }) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return { id: snap.id, email: data.email || "", displayName: data.displayName || "", createdAt: data.createdAt } as import("@/types").UserProfile;
}

// ---- User Roles (per shop) ----
export async function assignUserRole(userId: string, shopId: string, role: "owner" | "attendant" | "manager") {
  const id = `${userId}_${shopId}`;
  await setDoc(doc(db, "user_roles", id), {
    userId,
    shopId,
    role,
    assignedAt: serverTimestamp(),
  });
}

export async function getUserRoles(userId: string) {
  const q = query(collection(db, "user_roles"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getShopUsers(shopId: string) {
  const q = query(collection(db, "user_roles"), where("shopId", "==", shopId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function removeUserRole(userId: string, shopId: string) {
  const id = `${userId}_${shopId}`;
  await deleteDoc(doc(db, "user_roles", id));
}

// ---- Shops ----
export async function getShops(ownerId: string) {
  const q = query(collection(db, "shops"), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Shop));
}

export async function addShop(data: Omit<Shop, "id">) {
  const ref = await addDoc(collection(db, "shops"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateShop(id: string, data: Partial<Shop>) {
  await updateDoc(doc(db, "shops", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteShop(id: string) {
  await deleteDoc(doc(db, "shops", id));
}

// ---- Products ----
export async function getProducts(shopId: string) {
  const q = query(collection(db, "products"), where("shopId", "==", shopId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function addProduct(data: Omit<Product, "id">) {
  const ref = await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(db, "products", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}

// ============================================================
// SALES — Time-Bucketed Structure
// Path: shops/{shopId}/sales_days/{YYYY-MM-DD}/sales/{saleId}
// Summary: shops/{shopId}/sales_days/{YYYY-MM-DD}  (the day doc itself)
// ============================================================

/**
 * Add a sale AND atomically update the daily summary using a Firestore transaction.
 */
export async function addSaleWithSummary(
  data: Omit<Sale, "id">,
  profit: number
): Promise<string> {
  const dateStr = data.date; // YYYY-MM-DD
  const dayDocRef = doc(db, "shops", data.shopId, "sales_days", dateStr);
  const salesColRef = collection(dayDocRef, "sales");

  // We need addDoc inside a transaction — use a pre-generated doc ref
  const newSaleRef = doc(salesColRef);

  await runTransaction(db, async (tx) => {
    const daySnap = await tx.get(dayDocRef);

    if (daySnap.exists()) {
      // Update existing summary
      tx.update(dayDocRef, {
        totalSales: increment(data.totalPrice),
        transactions: increment(1),
        profit: increment(profit),
      });
    } else {
      // Create new day summary
      tx.set(dayDocRef, {
        date: dateStr,
        totalSales: data.totalPrice,
        transactions: 1,
        profit,
      });
    }

    // Write the sale document
    tx.set(newSaleRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  });

  return newSaleRef.id;
}

/**
 * Legacy addSale — wraps addSaleWithSummary with 0 profit when unknown.
 */
export async function addSale(data: Omit<Sale, "id">): Promise<string> {
  const profit = data.buyingPrice
    ? (data.totalPrice - data.buyingPrice * data.quantity)
    : Math.round(data.totalPrice * 0.3);
  return addSaleWithSummary(data, profit);
}

/**
 * Get all sales for a specific date.
 */
export async function getSalesByDate(shopId: string, dateStr: string): Promise<Sale[]> {
  const salesCol = collection(db, "shops", shopId, "sales_days", dateStr, "sales");
  const snap = await getDocs(salesCol);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Sale));
}

/**
 * Get daily summary for a specific date (single doc read).
 */
export async function getDailySummary(shopId: string, dateStr: string): Promise<DailySalesSummary | null> {
  const dayDoc = doc(db, "shops", shopId, "sales_days", dateStr);
  const snap = await getDoc(dayDoc);
  if (!snap.exists()) return null;
  return snap.data() as DailySalesSummary;
}

/**
 * Get daily summaries for a date range (for reports / charts).
 */
export async function getSummariesForRange(
  shopId: string,
  startDate: string,
  endDate: string
): Promise<DailySalesSummary[]> {
  // sales_days doc IDs are YYYY-MM-DD, so lexicographic ordering works
  const salesDaysCol = collection(db, "shops", shopId, "sales_days");
  const snap = await getDocs(salesDaysCol);
  return snap.docs
    .filter((d) => d.id >= startDate && d.id <= endDate)
    .map((d) => ({ ...d.data(), date: d.id } as DailySalesSummary))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get sales for a date range (fetches individual sales from each day).
 */
export async function getSalesForRange(
  shopId: string,
  startDate: string,
  endDate: string
): Promise<Sale[]> {
  // First get the day docs in range
  const salesDaysCol = collection(db, "shops", shopId, "sales_days");
  const daysSnap = await getDocs(salesDaysCol);
  const daysInRange = daysSnap.docs.filter((d) => d.id >= startDate && d.id <= endDate);

  const allSales: Sale[] = [];
  for (const dayDoc of daysInRange) {
    const salesCol = collection(db, "shops", shopId, "sales_days", dayDoc.id, "sales");
    const salesSnap = await getDocs(salesCol);
    for (const s of salesSnap.docs) {
      allSales.push({ id: s.id, ...s.data() } as Sale);
    }
  }
  return allSales;
}

/**
 * @deprecated Use getSalesByDate or getSalesForRange instead.
 * Kept for backward compatibility — fetches today's sales.
 */
export async function getSales(shopId: string): Promise<Sale[]> {
  const today = new Date().toISOString().split("T")[0];
  return getSalesByDate(shopId, today);
}

// ---- Suppliers ----
export async function getSuppliers(ownerId: string) {
  const q = query(collection(db, "suppliers"), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Supplier));
}

export async function addSupplier(data: Omit<Supplier, "id">) {
  const ref = await addDoc(collection(db, "suppliers"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateSupplier(id: string, data: Partial<Supplier>) {
  await updateDoc(doc(db, "suppliers", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteSupplier(id: string) {
  await deleteDoc(doc(db, "suppliers", id));
}

// ---- Expenses ----
export async function getExpenses(shopId: string) {
  const q = query(collection(db, "expenses"), where("shopId", "==", shopId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense));
}

export async function addExpense(data: Omit<Expense, "id">) {
  const ref = await addDoc(collection(db, "expenses"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateExpense(id: string, data: Partial<Expense>) {
  await updateDoc(doc(db, "expenses", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteExpense(id: string) {
  await deleteDoc(doc(db, "expenses", id));
}
