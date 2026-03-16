import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  BarChart3,
  Truck,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShops, setCurrentShop } from "@/store/shopsSlice";
import { logoutUser } from "@/store/authSlice";
import { useUserRole } from "@/hooks/useUserRole";
import { roleNavAccess } from "@/lib/permissions";
import type { AppRole } from "@/types";

const allNavItems = [
  { label: "Dashibodi", icon: LayoutDashboard, path: "/app" },
  { label: "Maduka", icon: Store, path: "/app/maduka" },
  { label: "Bidhaa", icon: Package, path: "/app/bidhaa" },
  { label: "Mauzo", icon: ShoppingCart, path: "/app/mauzo" },
  { label: "Matumizi", icon: BarChart3, path: "/app/matumizi" },
  { label: "Wasambazaji", icon: Truck, path: "/app/wasambazaji" },
  { label: "Watumiaji", icon: Users, path: "/app/watumiaji" },
];

const roleLabels: Record<AppRole, string> = {
  owner: "Mmiliki",
  manager: "Meneja",
  attendant: "Muuzaji",
};

interface AppLayoutProps {
  children?: React.ReactNode; // optional to support Outlet
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { shops, currentShopId } = useAppSelector((s) => s.shops);
  const { role, permissions } = useUserRole();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  // Filter nav items based on role
  const navItems = useMemo(() => {
    if (!role) return allNavItems.filter((i) => i.path === "/app");
    const allowed = roleNavAccess[role];
    return allNavItems.filter((i) => allowed.includes(i.path));
  }, [role]);

  const currentShop = shops.find((s) => s.id === currentShopId);

  // Fetch shops on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchShops(user.id));
    }
  }, [user?.id, dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo + Close */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Store className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-primary-foreground">
            DukaSmart
          </span>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shop Selector */}
        <div className="px-3 py-3">
          <div className="relative">
            <button
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              className="flex w-full items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2.5 text-sm text-sidebar-accent-foreground hover:bg-sidebar-accent/80 transition-colors"
            >
              <Store className="h-4 w-4 text-sidebar-muted" />
              <span className="flex-1 text-left truncate">
                {currentShop?.name || "Chagua Duka"}
              </span>
              <ChevronDown className="h-4 w-4 text-sidebar-muted" />
            </button>

            {shopDropdownOpen && shops.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-lg border border-sidebar-border bg-sidebar shadow-lg z-10">
                {shops.map((shop) => (
                  <button
                    key={shop.id}
                    onClick={() => {
                      dispatch(setCurrentShop(shop.id));
                      setShopDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                      shop.id === currentShopId
                        ? "bg-sidebar-primary/20 text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <Store className="h-4 w-4" />
                    {shop.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          {role && (
            <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
              <ShieldAlert className="h-3.5 w-3.5 text-sidebar-muted" />
              <span className="text-xs font-medium text-sidebar-muted">
                {roleLabels[role]}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
              {user?.displayName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.displayName || "Mtumiaji"}
              </p>
              <p className="text-xs text-sidebar-muted truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 hover:bg-sidebar-accent transition-colors"
              title="Toka"
            >
              <LogOut className="h-4 w-4 text-sidebar-muted" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b px-4 lg:px-6">
          <button
            className="lg:hidden text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </header>

        {/* Outlet for nested routes or children */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}