import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { getPermissions, type RolePermissions } from "@/lib/permissions";
import type { AppRole } from "@/types";

/**
 * Returns the user's role for the currently selected shop,
 * plus the resolved permissions object.
 */
export function useUserRole() {
  const roles = useAppSelector((s) => s.auth.roles);
  const currentShopId = useAppSelector((s) => s.shops.currentShopId);
  const user = useAppSelector((s) => s.auth.user);

  const currentRole: AppRole | null = useMemo(() => {
    if (!currentShopId || !roles.length) return null;
    const match = roles.find((r) => r.shopId === currentShopId);
    return match?.role ?? null;
  }, [roles, currentShopId]);

  const permissions: RolePermissions = useMemo(
    () => getPermissions(currentRole),
    [currentRole]
  );

  return { role: currentRole, permissions, userId: user?.id ?? null };
}
