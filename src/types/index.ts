export interface Shop {
  id: string;
  name: string;
  location: string;
  ownerId: string;
  phone?: string;
  description?: string;
  salesTotal?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  supplier: string;
  shopId: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  description?: string;
  unit?: string;
  weight?: string;
  size?: string;
  color?: string;
  expiryDate?: string;
  imageUrl?: string;
  status?: "active" | "inactive" | "discontinued";
  tags?: string;
  warranty?: string;
  discount?: number;
  taxRate?: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  buyingPrice?: number;
  paymentMethod: string;
  date: string;
  shopId: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  status?: "completed" | "draft";
  createdBy?: string;
  createdByName?: string;
}

/** Daily summary stored at shops/{shopId}/sales_days/{YYYY-MM-DD} */
export interface DailySalesSummary {
  date: string;
  totalSales: number;
  transactions: number;
  profit: number;
}

export interface Expense {
  id: string;
  shopId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  products: string;
  notes: string;
  ownerId: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  createdAt?: any;
}

export interface UserRole {
  id: string;
  userId: string;
  shopId: string;
  role: "owner" | "attendant" | "manager";
  assignedAt?: any;
}

export type AppRole = "owner" | "attendant" | "manager";
