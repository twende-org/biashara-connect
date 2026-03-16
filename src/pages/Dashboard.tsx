import { useEffect, useMemo } from "react";
import {
  TrendingUp, ShoppingCart, Package, AlertTriangle, DollarSign,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/productsSlice";
import { fetchTodaySummary, fetchSummariesForRange, fetchSales } from "@/store/salesSlice";
import { formatTZS } from "@/data/mockData";
import { useUserRole } from "@/hooks/useUserRole";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const currentShopId = useAppSelector((s) => s.shops.currentShopId);
  const products = useAppSelector((s) => s.products.products);
  const todaySummary = useAppSelector((s) => s.sales.todaySummary);
  const rangeSummaries = useAppSelector((s) => s.sales.rangeSummaries);
  const sales = useAppSelector((s) => s.sales.sales);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!currentShopId) return;
    // Single doc read for today's stats
    dispatch(fetchTodaySummary(currentShopId));
    // Products for stock alerts
    dispatch(fetchProducts(currentShopId));
    // Today's sales for recent sales list
    dispatch(fetchSales(currentShopId));

    // Weekly summaries for chart (7 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    dispatch(fetchSummariesForRange({
      shopId: currentShopId,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    }));
  }, [currentShopId, dispatch]);

  const lowStock = useMemo(() => products.filter((p) => p.stock <= p.minStock), [products]);
  const totalStockValue = useMemo(() => products.reduce((sum, p) => sum + p.sellingPrice * p.stock, 0), [products]);

  // Build weekly chart from summaries (fills in zero-days)
  const weeklySalesData = useMemo(() => {
    const days = ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alhamisi", "Ijumaa", "Jumamosi"];
    const now = new Date();
    const weekData: { day: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const summary = rangeSummaries.find((s) => s.date === dateStr);
      weekData.push({ day: days[d.getDay()], amount: summary?.totalSales || 0 });
    }
    return weekData;
  }, [rangeSummaries]);

  const todayRevenue = todaySummary?.totalSales || 0;
  const todayProfit = todaySummary?.profit || 0;
  const todayTransactions = todaySummary?.transactions || 0;

  const stats = [
    {
      label: "Mauzo ya Leo",
      value: formatTZS(todayRevenue),
      change: `${todayTransactions} mauzo`,
      icon: ShoppingCart,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Faida ya Leo",
      value: formatTZS(Math.round(todayProfit)),
      change: todayRevenue > 0 ? `${((todayProfit / todayRevenue) * 100).toFixed(0)}%` : "0%",
      icon: TrendingUp,
      color: "bg-success/10 text-success",
    },
    {
      label: "Bidhaa Zote",
      value: products.length.toString(),
      change: formatTZS(totalStockValue),
      icon: Package,
      color: "bg-info/10 text-info",
    },
    {
      label: "Stoo ya Chini",
      value: lowStock.length.toString(),
      change: lowStock.length > 0 ? "Tahadhari!" : "Sawa",
      icon: AlertTriangle,
      color: "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashibodi</h1>
        <p className="page-description">Muhtasari wa biashara yako ya leo</p>
      </div>

      {!currentShopId ? (
        <div className="stat-card text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Ongeza duka kwanza ili kuona takwimu</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly Chart */}
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <div className="stat-card lg:col-span-2">
              <h2 className="text-base font-semibold mb-4">Mauzo ya Wiki (Siku 7 zilizopita)</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [formatTZS(value), "Mauzo"]} contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(30,15%,88%)" }} />
                    <Bar dataKey="amount" fill="hsl(36, 90%, 50%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stock Alerts */}
            <div className="stat-card">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Tahadhari ya Stoo
              </h2>
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Hakuna bidhaa yenye stoo ya chini 🎉</p>
              ) : (
                <div className="space-y-3">
                  {lowStock.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-destructive/5 p-3">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Min: {p.minStock} {p.unit || "pcs"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-destructive">{p.stock}</p>
                        <p className="text-xs text-muted-foreground">zilizobaki</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="stat-card">
            <h2 className="text-base font-semibold mb-4">Mauzo ya Hivi Karibuni</h2>
            {sales.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Hakuna mauzo bado</p>
            ) : (
              <div className="space-y-3">
                {sales.slice(0, 8).map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{sale.productName}</p>
                      <p className="text-xs text-muted-foreground">x{sale.quantity} · {sale.paymentMethod} · {sale.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-success">+{formatTZS(sale.totalPrice)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
