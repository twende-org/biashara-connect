import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, Shield, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/authSlice";
import { isSystemAdmin } from "@/lib/subscription";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user?.id) { setAuthorized(false); return; }
    isSystemAdmin(user.id).then(setAuthorized);
  }, [user?.id]);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">{t("admin.unauthorized")}</h1>
          <p className="text-muted-foreground mb-6">{t("admin.unauthorizedDesc")}</p>
          <Link to="/app" className="text-primary hover:underline">{t("admin.backToApp")}</Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: t("admin.dashboard"), icon: LayoutDashboard, path: "/admin" },
    { label: t("admin.users"), icon: Users, path: "/admin/users" },
    { label: t("admin.payments"), icon: CreditCard, path: "/admin/payments" },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive">
            <Shield className="h-5 w-5 text-destructive-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-primary-foreground">Admin Panel</span>
          <button className="ml-auto lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                <item.icon className="h-5 w-5" />{item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3 space-y-2">
          <Link to="/app" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />{t("admin.backToApp")}
          </Link>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground">
              {user?.displayName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.displayName || "Admin"}</p>
              <p className="text-xs text-sidebar-muted truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="rounded-lg p-1.5 hover:bg-sidebar-accent transition-colors" title={t("auth.logout")}>
              <LogOut className="h-4 w-4 text-sidebar-muted" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b px-4 lg:px-6">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-sm font-medium text-destructive bg-destructive/10 px-3 py-1 rounded-full">ADMIN</span>
          <div className="flex-1" />
          <LanguageToggle variant="ghost" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
