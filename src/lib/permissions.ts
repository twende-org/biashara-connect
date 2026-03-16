import type { AppRole } from "@/types";
import {
  LayoutDashboard, Package, ShoppingCart, Store, BarChart3, Truck, Users,
} from "lucide-react";

/** Which nav paths each role can access */
export const roleNavAccess: Record<AppRole, string[]> = {
  owner: [
    "/app",
    "/app/maduka",
    "/app/bidhaa",
    "/app/mauzo",
    "/app/matumizi",
    "/app/wasambazaji",
    "/app/watumiaji",
  ],
  manager: [
    "/app",
    "/app/bidhaa",
    "/app/mauzo",
    "/app/matumizi",
    "/app/wasambazaji",
  ],
  attendant: [
    "/app",
    "/app/mauzo",
    "/app/bidhaa",
  ],
};

/** Granular permissions per role */
export interface RolePermissions {
  canViewDashboardProfit: boolean;
  canViewDashboardStock: boolean;
  // Products
  canAddProduct: boolean;
  canEditProduct: boolean;
  canDeleteProduct: boolean;
  // Sales
  canAddSale: boolean;
  canDeleteSale: boolean;
  canConfirmDraft: boolean;
  canEditDraft: boolean;
  canDeleteDraft: boolean;
  // Expenses
  canAddExpense: boolean;
  canEditExpense: boolean;
  canDeleteExpense: boolean;
  // Suppliers
  canAddSupplier: boolean;
  canEditSupplier: boolean;
  canDeleteSupplier: boolean;
  // Shops
  canManageShops: boolean;
  // Users
  canManageUsers: boolean;
}

export const rolePermissions: Record<AppRole, RolePermissions> = {
  owner: {
    canViewDashboardProfit: true,
    canViewDashboardStock: true,
    canAddProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canAddSale: true,
    canDeleteSale: true,
    canConfirmDraft: true,
    canEditDraft: true,
    canDeleteDraft: true,
    canAddExpense: true,
    canEditExpense: true,
    canDeleteExpense: true,
    canAddSupplier: true,
    canEditSupplier: true,
    canDeleteSupplier: true,
    canManageShops: true,
    canManageUsers: true,
  },
  manager: {
    canViewDashboardProfit: true,
    canViewDashboardStock: true,
    canAddProduct: true,
    canEditProduct: true,
    canDeleteProduct: false,
    canAddSale: true,
    canDeleteSale: false,
    canConfirmDraft: true,
    canEditDraft: true,
    canDeleteDraft: true,
    canAddExpense: true,
    canEditExpense: true,
    canDeleteExpense: false,
    canAddSupplier: true,
    canEditSupplier: true,
    canDeleteSupplier: false,
    canManageShops: false,
    canManageUsers: false,
  },
  attendant: {
    canViewDashboardProfit: false,
    canViewDashboardStock: false,
    canAddProduct: false,
    canEditProduct: false,
    canDeleteProduct: false,
    canAddSale: true,
    canDeleteSale: false,
    canConfirmDraft: false,
    canEditDraft: true,
    canDeleteDraft: false,
    canAddExpense: false,
    canEditExpense: false,
    canDeleteExpense: false,
    canAddSupplier: false,
    canEditSupplier: false,
    canDeleteSupplier: false,
    canManageShops: false,
    canManageUsers: false,
  },
};

export function getPermissions(role: AppRole | null): RolePermissions {
  if (!role) return rolePermissions.attendant; // most restrictive fallback
  return rolePermissions[role];
}

export function canAccessPath(role: AppRole | null, path: string): boolean {
  if (!role) return false;
  return roleNavAccess[role].includes(path);
}
