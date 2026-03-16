import { useEffect, useState } from "react";
import { Plus, Search, Loader2, Wallet, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchExpenses, createExpense, editExpense, removeExpense } from "@/store/expensesSlice";
import { formatTZS } from "@/data/mockData";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";

const EXPENSE_CATEGORIES = [
  "Kodi ya Duka", "Umeme", "Maji", "Usafiri", "Mishahara",
  "Matengenezo", "Vifungashio", "Matangazo", "Simu/Internet",
  "Chakula", "Kodi/Ushuru", "Nyingine",
];

const emptyForm = { category: "", description: "", amount: 0, date: new Date().toISOString().split("T")[0], paymentMethod: "Taslimu", reference: "", notes: "" };

export default function Expenses() {
  const dispatch = useAppDispatch();
  const currentShopId = useAppSelector((s) => s.shops.currentShopId);
  const { expenses, loading } = useAppSelector((s) => s.expenses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentShopId) dispatch(fetchExpenses(currentShopId));
  }, [currentShopId, dispatch]);

  const filtered = expenses.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || e.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalExpenses = filtered.reduce((sum, e) => sum + e.amount, 0);

  const openEdit = (exp: typeof expenses[0]) => {
    setEditId(exp.id);
    setForm({ category: exp.category, description: exp.description, amount: exp.amount, date: exp.date, paymentMethod: exp.paymentMethod, reference: exp.reference || "", notes: exp.notes || "" });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShopId || !form.category || !form.description || form.amount <= 0) {
      toast.error("Jaza taarifa zote muhimu");
      return;
    }
    setSubmitting(true);
    setProgress(30);
    try {
      setProgress(60);
      if (editId) {
        await dispatch(editExpense({ id: editId, data: { ...form, amount: +form.amount } })).unwrap();
        toast.success("Matumizi yamebadilishwa!");
      } else {
        await dispatch(createExpense({
          ...form,
          amount: +form.amount,
          shopId: currentShopId,
          reference: form.reference || undefined,
          notes: form.notes || undefined,
        })).unwrap();
        toast.success("Matumizi yamerekodiwa!");
      }
      setProgress(100);
      setTimeout(() => {
        setDialogOpen(false);
        setForm(emptyForm);
        setEditId(null);
        setProgress(0);
      }, 300);
    } catch (err: any) {
      toast.error(err?.message || "Imeshindikana");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Una uhakika unataka kufuta matumizi haya?")) return;
    try {
      await dispatch(removeExpense(id)).unwrap();
      toast.success("Matumizi yamefutwa");
    } catch {
      toast.error("Imeshindikana kufuta");
    }
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Matumizi</h1>
          <p className="page-description">Rekodi na fuatilia matumizi ya biashara</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setForm(emptyForm); setEditId(null); setProgress(0); } }}>
          <DialogTrigger asChild>
            <Button disabled={!currentShopId}><Plus className="h-4 w-4 mr-2" />Matumizi Mapya</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editId ? "Hariri Matumizi" : "Rekodi Matumizi Mapya"}</DialogTitle></DialogHeader>
            {submitting && <Progress value={progress} className="h-1.5" />}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Kategoria *</label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Chagua..." /></SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Tarehe *</label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Maelezo *</label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mfano: Kodi ya mwezi Machi" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Kiasi (TZS) *</label>
                  <Input type="number" min={1} value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Njia ya Malipo</label>
                  <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Taslimu">Taslimu</SelectItem>
                      <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                      <SelectItem value="Tigo Pesa">Tigo Pesa</SelectItem>
                      <SelectItem value="Benki">Benki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Namba ya Risiti</label>
                  <Input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Si lazima" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Maelezo Zaidi</label>
                  <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Si lazima" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Inaendelea...</> : editId ? "Hifadhi Mabadiliko" : "Rekodi Matumizi"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tafuta matumizi..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kategoria Zote</SelectItem>
            {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      {currentShopId && !loading && expenses.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Jumla Matumizi</p>
            <p className="text-xl font-bold text-destructive">{formatTZS(totalExpenses)}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Idadi</p>
            <p className="text-xl font-bold text-foreground">{filtered.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Wastani</p>
            <p className="text-xl font-bold text-foreground">{formatTZS(filtered.length > 0 ? Math.round(totalExpenses / filtered.length) : 0)}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Kubwa Zaidi</p>
            <p className="text-xl font-bold text-foreground">{formatTZS(filtered.length > 0 ? Math.max(...filtered.map(e => e.amount)) : 0)}</p>
          </div>
        </div>
      )}

      {!currentShopId ? (
        <div className="stat-card text-center py-12">
          <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Ongeza duka kwanza</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" /></div>
      ) : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Kategoria</th>
                <th className="pb-3 font-medium">Maelezo</th>
                <th className="pb-3 font-medium text-right">Kiasi</th>
                <th className="pb-3 font-medium hidden sm:table-cell">Malipo</th>
                <th className="pb-3 font-medium">Tarehe</th>
                <th className="pb-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Hakuna matumizi bado</td></tr>
              ) : filtered.map((e, i) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 text-muted-foreground">{i + 1}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-foreground">{e.description}</td>
                  <td className="py-3 text-right font-semibold text-destructive">{formatTZS(e.amount)}</td>
                  <td className="py-3 text-muted-foreground hidden sm:table-cell">{e.paymentMethod}</td>
                  <td className="py-3 text-muted-foreground">{e.date}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(e)} className="rounded p-1 hover:bg-muted"><Edit2 className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(e.id)} className="rounded p-1 hover:bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t pt-3 mt-2 text-xs text-muted-foreground">
            <span>Jumla: {filtered.length} matumizi</span>
            <span className="font-semibold text-destructive text-sm">{formatTZS(totalExpenses)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
