import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Store, Loader2, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShops, createShop, editShop, removeShop } from "@/store/shopsSlice";
import { assignUserRole } from "@/lib/firestore";
import { toast } from "sonner";
import ShopMap from "@/components/ShopMap";

export default function Shops() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { shops, loading } = useAppSelector((s) => s.shops);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<any>(null);
  const [form, setForm] = useState({ name: "", location: "", phone: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedMap, setExpandedMap] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) dispatch(fetchShops(user.id));
  }, [user?.id, dispatch]);

  const filtered = shops.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setProgress(30);
    try {
      setProgress(60);
      if (editingShop) {
        await dispatch(editShop({ id: editingShop.id, data: form })).unwrap();
        toast.success("Duka limesasishwa!");
      } else {
        const result = await dispatch(createShop({ ...form, ownerId: user!.id })).unwrap();
        await assignUserRole(user!.id, result.id, "owner");
        toast.success("Duka limeongezwa!");
      }
      setProgress(100);
      setTimeout(() => {
        setDialogOpen(false);
        setEditingShop(null);
        setForm({ name: "", location: "", phone: "", description: "" });
        setProgress(0);
      }, 300);
    } catch (err: any) {
      toast.error(err?.message || "Imeshindikana");
    }
    setSubmitting(false);
  };

  const handleEdit = (shop: any) => {
    setEditingShop(shop);
    setForm({ name: shop.name, location: shop.location || "", phone: shop.phone || "", description: shop.description || "" });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await dispatch(removeShop(id));
    toast.success("Duka limefutwa!");
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Maduka</h1>
          <p className="page-description">Simamia maduka yako yote</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setEditingShop(null); setForm({ name: "", location: "", phone: "", description: "" }); setProgress(0); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Ongeza Duka</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingShop ? "Hariri Duka" : "Ongeza Duka Jipya"}</DialogTitle>
            </DialogHeader>
            {submitting && <Progress value={progress} className="h-1" />}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Jina la Duka</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Mfano: Duka la Mama Amina" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Mahali</label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required placeholder="Mfano: Dodoma, Tanzania" />
                <p className="text-xs text-muted-foreground mt-1">Andika anwani kamili kwa ramani sahihi</p>
              </div>
              {/* Map Preview in Form */}
              {form.location.length > 3 && (
                <ShopMap location={form.location} shopName={form.name || undefined} className="h-[200px]" />
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Simu</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Mfano: +255 712 345 678" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Maelezo</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Elezea duka lako kwa ufupi..." rows={2} />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Inaendelea...</> : (editingShop ? "Sasisha" : "Ongeza")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tafuta duka..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="stat-card text-center py-12">
          <Store className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Hakuna maduka bado. Ongeza duka lako la kwanza!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((shop) => (
            <div key={shop.id} className="stat-card overflow-hidden">
              {/* Map Preview */}
              {shop.location && (
                <div
                  className={`transition-all duration-300 cursor-pointer ${expandedMap === shop.id ? "h-[250px]" : "h-[120px]"}`}
                  onClick={() => setExpandedMap(expandedMap === shop.id ? null : shop.id)}
                >
                  <ShopMap location={shop.location} shopName={shop.name} className="h-full" compact showActions={false} />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(shop)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDelete(shop.id)} className="rounded-lg p-1.5 hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">{shop.name}</h3>
                {shop.location && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {shop.location}
                  </p>
                )}
                {shop.phone && (
                  <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-primary" /> {shop.phone}
                  </p>
                )}
                {shop.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{shop.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
