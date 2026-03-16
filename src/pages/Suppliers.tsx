import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Truck, Loader2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSuppliers, createSupplier, editSupplier, removeSupplier } from "@/store/suppliersSlice";
import { toast } from "sonner";
import type { Supplier } from "@/types";
import { useUserRole } from "@/hooks/useUserRole";

const defaultForm = { name: "", phone: "", email: "", address: "", products: "", notes: "" };

export default function Suppliers() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { permissions } = useUserRole();
  const { suppliers, loading } = useAppSelector((s) => s.suppliers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSup, setEditingSup] = useState<Supplier | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user?.id) dispatch(fetchSuppliers(user.id));
  }, [user?.id, dispatch]);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.toLowerCase().includes(search.toLowerCase()) ||
    (s.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const resetForm = () => setForm(defaultForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setProgress(30);
    try {
      setProgress(60);
      if (editingSup) {
        await dispatch(editSupplier({ id: editingSup.id, data: form })).unwrap();
        toast.success("Msambazaji amesasishwa!");
      } else {
        await dispatch(createSupplier({ ...form, ownerId: user!.id })).unwrap();
        toast.success("Msambazaji ameongezwa!");
      }
      setProgress(100);
      setTimeout(() => {
        setDialogOpen(false);
        setEditingSup(null);
        resetForm();
        setProgress(0);
      }, 300);
    } catch (err: any) {
      toast.error(err?.message || "Imeshindikana");
    }
    setSubmitting(false);
  };

  const handleEdit = (s: Supplier) => {
    setEditingSup(s);
    setForm({
      name: s.name,
      phone: s.phone,
      email: s.email || "",
      address: s.address || "",
      products: s.products,
      notes: s.notes,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(removeSupplier(id)).unwrap();
      toast.success("Msambazaji amefutwa!");
    } catch (err: any) {
      toast.error(err?.message || "Imeshindikana kufuta");
    }
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Wasambazaji</h1>
          <p className="page-description">Simamia wasambazaji wako</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setEditingSup(null); resetForm(); setProgress(0); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Ongeza Msambazaji</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSup ? "Hariri Msambazaji" : "Ongeza Msambazaji Mpya"}</DialogTitle>
            </DialogHeader>
            {submitting && <Progress value={progress} className="h-1" />}
            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Jina *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Jina la msambazaji" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Simu *</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+255 7XX XXX XXX" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Barua Pepe</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@mfano.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Anwani</label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Mahali alipo msambazaji" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Bidhaa</label>
                <Input value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} placeholder="Bidhaa anazosambaza" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Maelezo</label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Maelezo mengine..." />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Inaendelea...</> : (editingSup ? "Sasisha" : "Ongeza")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tafuta msambazaji..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="stat-card text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Hakuna wasambazaji bado</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div key={s.id} className="stat-card">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(s)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="rounded-lg p-1.5 hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{s.phone}</p>
                {s.email && <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{s.email}</p>}
                {s.address && <p className="text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{s.address}</p>}
              </div>
              {s.products && <p className="text-xs text-muted-foreground mt-2">📦 {s.products}</p>}
              {s.notes && <p className="text-xs text-muted-foreground mt-1 italic">{s.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
