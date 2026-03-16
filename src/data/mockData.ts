export interface Shop {
  id: string;
  name: string;
  location: string;
  salesTotal: number;
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
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  date: string;
  shopId: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  products: string;
  notes: string;
}

export const shops: Shop[] = [
  { id: "1", name: "Duka la Kariakoo", location: "Kariakoo, Dar es Salaam", salesTotal: 2450000 },
  { id: "2", name: "Duka la Mlimani", location: "Mlimani City, Dar es Salaam", salesTotal: 1830000 },
  { id: "3", name: "Duka la UDOM", location: "Dodoma", salesTotal: 980000 },
];

export const products: Product[] = [
  { id: "1", name: "Charger ya Samsung", category: "Vifaa vya Simu", buyingPrice: 8000, sellingPrice: 15000, stock: 45, minStock: 10, supplier: "TechSupply TZ", shopId: "1" },
  { id: "2", name: "Earphones", category: "Vifaa vya Simu", buyingPrice: 3000, sellingPrice: 5000, stock: 3, minStock: 5, supplier: "TechSupply TZ", shopId: "1" },
  { id: "3", name: "Power Bank 10000mAh", category: "Vifaa vya Simu", buyingPrice: 15000, sellingPrice: 25000, stock: 20, minStock: 5, supplier: "China Direct", shopId: "1" },
  { id: "4", name: "USB Cable Type-C", category: "Vifaa vya Simu", buyingPrice: 2000, sellingPrice: 5000, stock: 2, minStock: 10, supplier: "TechSupply TZ", shopId: "1" },
  { id: "5", name: "Screen Protector", category: "Vifaa vya Simu", buyingPrice: 1000, sellingPrice: 3000, stock: 60, minStock: 15, supplier: "China Direct", shopId: "1" },
  { id: "6", name: "Phone Case", category: "Vifaa vya Simu", buyingPrice: 2500, sellingPrice: 5000, stock: 35, minStock: 10, supplier: "TechSupply TZ", shopId: "2" },
  { id: "7", name: "Bluetooth Speaker", category: "Elektroniki", buyingPrice: 20000, sellingPrice: 35000, stock: 8, minStock: 3, supplier: "China Direct", shopId: "2" },
  { id: "8", name: "Memory Card 32GB", category: "Vifaa vya Simu", buyingPrice: 5000, sellingPrice: 10000, stock: 15, minStock: 5, supplier: "TechSupply TZ", shopId: "2" },
];

export const recentSales: Sale[] = [
  { id: "1", productId: "1", productName: "Charger ya Samsung", quantity: 2, totalPrice: 30000, paymentMethod: "Taslimu", date: "2026-03-09", shopId: "1" },
  { id: "2", productId: "3", productName: "Power Bank 10000mAh", quantity: 1, totalPrice: 25000, paymentMethod: "M-Pesa", date: "2026-03-09", shopId: "1" },
  { id: "3", productId: "5", productName: "Screen Protector", quantity: 3, totalPrice: 9000, paymentMethod: "Taslimu", date: "2026-03-09", shopId: "1" },
  { id: "4", productId: "2", productName: "Earphones", quantity: 1, totalPrice: 5000, paymentMethod: "Taslimu", date: "2026-03-08", shopId: "1" },
  { id: "5", productId: "6", productName: "Phone Case", quantity: 2, totalPrice: 10000, paymentMethod: "M-Pesa", date: "2026-03-09", shopId: "2" },
  { id: "6", productId: "7", productName: "Bluetooth Speaker", quantity: 1, totalPrice: 35000, paymentMethod: "Taslimu", date: "2026-03-08", shopId: "2" },
];

export const suppliers: Supplier[] = [
  { id: "1", name: "TechSupply TZ", phone: "+255 712 345 678", products: "Charger, Earphones, USB Cable, Phone Case", notes: "Msambazaji mkuu wa vifaa vya simu" },
  { id: "2", name: "China Direct", phone: "+255 789 012 345", products: "Power Bank, Screen Protector, Bluetooth Speaker", notes: "Anaagiza moja kwa moja kutoka China" },
];

export const weeklySalesData = [
  { day: "Jumatatu", amount: 185000 },
  { day: "Jumanne", amount: 220000 },
  { day: "Jumatano", amount: 195000 },
  { day: "Alhamisi", amount: 310000 },
  { day: "Ijumaa", amount: 420000 },
  { day: "Jumamosi", amount: 380000 },
  { day: "Jumapili", amount: 150000 },
];

export const categorySalesData = [
  { category: "Vifaa vya Simu", amount: 850000 },
  { category: "Elektroniki", amount: 420000 },
  { category: "Kompyuta", amount: 280000 },
  { category: "Nyingine", amount: 120000 },
];

export function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString("en-US")}`;
}

export function getLowStockProducts(shopId?: string): Product[] {
  return products.filter(p => p.stock <= p.minStock && (!shopId || p.shopId === shopId));
}
