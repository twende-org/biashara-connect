import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { canAccessPath } from "@/lib/permissions";

interface RoleGuardProps {
  path: string;
  children: React.ReactNode;
}

/**
 * Redirects to /app if the user's role cannot access the given path.
 */
export default function RoleGuard({ path, children }: RoleGuardProps) {
  const { role } = useUserRole();

  // If no role yet (shops not loaded), show children (Dashboard will handle empty state)
  if (!role) return <>{children}</>;

  if (!canAccessPath(role, path)) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
