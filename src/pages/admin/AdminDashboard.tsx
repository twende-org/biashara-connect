import { useEffect, useState } from "react";
import { Users, CreditCard, Store, TrendingUp } from "lucide-react";
import { getAllUsers, getAllSubscriptions, PLAN_LIMITS, type Subscription } from "@/lib/subscription";
import { getAllShops } from "@/lib/firestore";
import { formatTZS } from "@/data/mockData";
import { useI18n } from "@/lib/i18n";

export default function AdminDashboard() {
  const { t } = useI18n();
  const [users, setUsers] = useState<any[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [shopCount, setShopCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllSubscriptions(), getAllShops()])
      .then(([u, s, shops]) => { setUsers(u); setSubs(s); setShopCount(shops.length); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeCount = subs.filter((s) => s.status === "active").length;
  const pendingCount = subs.filter((s) => s.status === "pending").length;
  const totalRevenue = subs.filter((s) => s.status === "active").reduce((sum, s) => sum + s.amount, 0);

  const stats = [
    { label: t("admin.totalUsers"), value: users.length, icon: Users, color: "bg-primary/10 text-primary" },
    { label: t("admin.activeSubscriptions"), value: activeCount, icon: CreditCard, color: "bg-success/10 text-success" },
    { label: t("admin.pendingPayments"), value: pendingCount, icon: TrendingUp, color: "bg-warning/10 text-warning" },
    { label: t("admin.totalShops"), value: shopCount, icon: Store, color: "bg-info/10 text-info" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t("admin.dashboardTitle")}</h1>
        <p className="page-description">{t("admin.dashboardDesc")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`rounded-lg p-2 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="stat-card">
        <h2 className="text-base font-semibold mb-4">{t("admin.monthlyRevenue")}</h2>
        <p className="text-3xl font-bold text-success">{formatTZS(totalRevenue)}<span className="text-sm font-normal text-muted-foreground">/mwezi</span></p>
      </div>
    </div>
  );
}
