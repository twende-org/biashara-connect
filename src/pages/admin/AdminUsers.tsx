import { useEffect, useState } from "react";
import { Users, Search, Shield, Crown, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUsers, getAllSubscriptions, setSystemAdmin, type Subscription, type PlanTier } from "@/lib/subscription";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

interface UserWithSub {
  id: string;
  email: string;
  displayName: string;
  createdAt?: any;
  subscription?: Subscription;
}

const planColors: Record<PlanTier, string> = {
  free: "bg-muted text-muted-foreground",
  basic: "bg-primary/10 text-primary",
  business: "bg-success/10 text-success",
  enterprise: "bg-info/10 text-info",
};

export default function AdminUsers() {
  const { t } = useI18n();
  const [users, setUsers] = useState<UserWithSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");

  async function loadData() {
    setLoading(true);
    try {
      const [allUsers, allSubs] = await Promise.all([getAllUsers(), getAllSubscriptions()]);
      const subsMap = new Map(allSubs.map((s) => [s.userId, s]));
      setUsers(allUsers.map((u) => ({ ...u, subscription: subsMap.get(u.id) })));
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase()) || u.displayName.toLowerCase().includes(search.toLowerCase());
    const plan = u.subscription?.plan || "free";
    const matchPlan = filterPlan === "all" || plan === filterPlan;
    return matchSearch && matchPlan;
  });

  async function handleMakeAdmin(userId: string, email: string) {
    try {
      await setSystemAdmin(userId, email);
      toast.success(`${email} is now a system admin`);
    } catch (err: any) { toast.error(err.message); }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t("admin.allUsers")}</h1>
        <p className="page-description">{t("admin.usersDesc")}</p>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("admin.searchUsers")} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">{t("users.name")}</th>
                <th className="pb-3 font-medium">{t("users.email")}</th>
                <th className="pb-3 font-medium">{t("admin.plan")}</th>
                <th className="pb-3 font-medium">{t("admin.status")}</th>
                <th className="pb-3 font-medium text-right">{t("users.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const plan = u.subscription?.plan || "free";
                const status = u.subscription?.status || "active";
                return (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{u.displayName}</td>
                    <td className="py-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${planColors[plan]}`}>
                        {plan}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        status === "active" ? "bg-success/10 text-success" : 
                        status === "pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => handleMakeAdmin(u.id, u.email)} title="Make Admin">
                        <Crown className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{t("admin.noUsers")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
