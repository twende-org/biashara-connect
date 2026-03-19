import { useState, useEffect } from "react";
import { UserPlus, Trash2, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { assignUserRole, getShopUsers, removeUserRole, getUserProfile } from "@/lib/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppRole } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface ShopUser {
  userId: string;
  email: string;
  displayName: string;
  role: AppRole;
  shopId: string;
}

const roleColors: Record<AppRole, string> = {
  owner: "bg-primary/10 text-primary",
  manager: "bg-info/10 text-info",
  attendant: "bg-accent/10 text-accent",
};

export default function UserManagement() {
  const shops = useAppSelector((s) => s.shops.shops);
  const currentShopId = useAppSelector((s) => s.shops.currentShopId);
  const { t } = useI18n();
  const [selectedShop, setSelectedShop] = useState(currentShopId || "");
  const [shopUsers, setShopUsers] = useState<ShopUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<AppRole>("attendant");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const roleLabels: Record<AppRole, string> = {
    owner: t("role.owner"),
    manager: t("role.manager"),
    attendant: t("role.attendant"),
  };

  useEffect(() => { if (currentShopId && !selectedShop) setSelectedShop(currentShopId); }, [currentShopId]);
  useEffect(() => { if (selectedShop) loadShopUsers(); }, [selectedShop]);

  async function loadShopUsers() {
    setLoading(true);
    try {
      const roles = await getShopUsers(selectedShop);
      const users: ShopUser[] = [];
      for (const role of roles) {
        const r = role as any;
        try {
          const profile = await getUserProfile(r.userId);
          users.push({ userId: r.userId, email: profile?.email || t("users.unknown"), displayName: profile?.displayName || t("users.unknown"), role: r.role, shopId: r.shopId });
        } catch {
          users.push({ userId: r.userId, email: t("users.unknown"), displayName: t("users.unknown"), role: r.role, shopId: r.shopId });
        }
      }
      setShopUsers(users);
    } catch (err) {
      console.error("Failed to load shop users:", err);
      toast.error(t("users.failedLoad"));
    }
    setLoading(false);
  }

  async function handleAssignUser(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true); setProgress(20);
    try {
      setProgress(40);
      const userSnap = await getDocs(query(collection(db, "users"), where("email", "==", newUserEmail.trim().toLowerCase())));
      if (userSnap.empty) { toast.error(t("users.notFound")); setSubmitting(false); setProgress(0); return; }
      setProgress(70);
      const userId = userSnap.docs[0].id;
      await assignUserRole(userId, selectedShop, newUserRole);
      setProgress(100);
      toast.success(t("users.assigned"));
      setTimeout(() => { setDialogOpen(false); setNewUserEmail(""); setNewUserRole("attendant"); setProgress(0); loadShopUsers(); }, 300);
    } catch (err: any) { toast.error(err.message || t("products.failed")); setProgress(0); }
    setSubmitting(false);
  }

  async function handleRemoveUser(userId: string) {
    try { await removeUserRole(userId, selectedShop); toast.success(t("users.removed")); loadShopUsers(); }
    catch (err: any) { toast.error(err.message || t("products.failed")); }
  }

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">{t("users.title")}</h1>
          <p className="page-description">{t("users.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setProgress(0); }}>
          <DialogTrigger asChild>
            <Button disabled={!selectedShop}><UserPlus className="h-4 w-4 mr-2" />{t("users.addUser")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("users.addToShop")}</DialogTitle></DialogHeader>
            {submitting && <Progress value={progress} className="h-1" />}
            <form onSubmit={handleAssignUser} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("users.userEmail")}</label>
                <Input placeholder="mfano@email.com" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("users.role")}</label>
                <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as AppRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">{t("role.manager")}</SelectItem>
                    <SelectItem value="attendant">{t("role.attendant")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("common.loading")}</> : t("users.assignRole")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 max-w-xs">
        <label className="text-sm font-medium text-foreground mb-1.5 block">{t("users.selectShop")}</label>
        <Select value={selectedShop} onValueChange={setSelectedShop}>
          <SelectTrigger><SelectValue placeholder={t("users.selectShopPlaceholder")} /></SelectTrigger>
          <SelectContent>
            {shops.map((shop) => (<SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {!selectedShop ? (
        <div className="stat-card text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("users.selectShopFirst")}</p>
        </div>
      ) : loading ? (
        <div className="stat-card text-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t("users.loading")}</p>
        </div>
      ) : shopUsers.length === 0 ? (
        <div className="stat-card text-center py-12">
          <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("users.noUsers")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("users.noUsersHint")}</p>
        </div>
      ) : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">{t("users.name")}</th>
                <th className="pb-3 font-medium">{t("users.email")}</th>
                <th className="pb-3 font-medium">{t("users.role")}</th>
                <th className="pb-3 font-medium text-right">{t("users.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {shopUsers.map((u) => (
                <tr key={u.userId} className="border-b last:border-0">
                  <td className="py-3 font-medium">{u.displayName}</td>
                  <td className="py-3 text-muted-foreground">{u.email}</td>
                  <td className="py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", roleColors[u.role])}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {u.role !== "owner" && (
                      <button onClick={() => handleRemoveUser(u.userId)} className="rounded-lg p-1.5 hover:bg-destructive/10 transition-colors">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}