import { useEffect, useState } from "react";
import { Plus, ShoppingCart, Search, Loader2, Trash2, Minus } from "lucide-react";
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
import { fetchSales, createSale } from "@/store/salesSlice";
import { fetchProducts, editProduct } from "@/store/productsSlice";
import { formatTZS } from "@/data/mockData";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useUserRole } from "@/hooks/useUserRole";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface CartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export default function Sales() {
  const dispatch = useAppDispatch();
  const currentShopId = useAppSelector((s) => s.shops.currentShopId);
  const { permissions } = useUserRole();
  const { log: logActivity } = useActivityLogger();
  const { sales, loading } = useAppSelector((s) => s.sales);
  const products = useAppSelector((s) => s.products.products);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addProductId, setAddProductId] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Taslimu");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentShopId) {
      dispatch(fetchSales(currentShopId));
      dispatch(fetchProducts(currentShopId));
    }
  }, [currentShopId, dispatch]);

  const activeProducts = products.filter(p => (p.status || "active") === "active");
  const cartTotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  const addToCart = () => {
    if (!addProductId) return;
    const product = products.find(p => p.id === addProductId);
    if (!product) return;

    const existingIdx = cart.findIndex(c => c.product.id === addProductId);
    const currentCartQty = existingIdx >= 0 ? cart[existingIdx].quantity : 0;

    if (currentCartQty + addQty > product.stock) {
      toast.error(`Stoo haitoshi! Stoo iliyobaki: ${product.stock - currentCartQty}`);
      return;
    }

    const discount = product.discount || 0;
    const unitPrice = product.sellingPrice * (1 - discount / 100);

    if (existingIdx >= 0) {
      const updated = [...cart];
      const newQty = updated[existingIdx].quantity + addQty;
      updated[existingIdx] = { ...updated[existingIdx], quantity: newQty, lineTotal: Math.round(unitPrice * newQty) };
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: addQty, lineTotal: Math.round(unitPrice * addQty) }]);
    }
    setAddProductId("");
    setAddQty(1);
  };

  const removeFromCart = (idx: number) => setCart(cart.filter((_, i) => i !== idx));

  const updateCartQty = (idx: number, newQty: number) => {
    if (newQty < 1) return;
    const item = cart[idx];
    if (newQty > item.product.stock) {
      toast.error(`Stoo haitoshi! Max: ${item.product.stock}`);
      return;
    }
    const discount = item.product.discount || 0;
    const unitPrice = item.product.sellingPrice * (1 - discount / 100);
    const updated = [...cart];
    updated[idx] = { ...item, quantity: newQty, lineTotal: Math.round(unitPrice * newQty) };
    setCart(updated);
  };

  const resetForm = () => {
    setCart([]);
    setAddProductId("");
    setAddQty(1);
    setPaymentMethod("Taslimu");
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    setProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShopId || cart.length === 0) return;
    setSubmitting(true);
    setProgress(10);

    try {
      const totalItems = cart.length;
      for (let i = 0; i < totalItems; i++) {
        const item = cart[i];
        setProgress(10 + Math.round(((i + 0.5) / totalItems) * 70));

        const profit = (item.product.sellingPrice - item.product.buyingPrice) * item.quantity;
        await dispatch(createSale({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          totalPrice: item.lineTotal,
          buyingPrice: item.product.buyingPrice,
          paymentMethod,
          date: new Date().toISOString().split("T")[0],
          shopId: currentShopId,
          customerName: customerName || undefined,
          customerPhone: customerPhone || undefined,
          notes: notes || undefined,
          profit,
        } as any)).unwrap();

        setProgress(10 + Math.round(((i + 1) / totalItems) * 70));

        // Stock update — only send stock field (attendant-safe)
        try {
          await dispatch(editProduct({
            id: item.product.id,
            data: { stock: item.product.stock - item.quantity },
          })).unwrap();
        } catch (stockErr: any) {
          console.error("Stock update failed for", item.product.name, stockErr);
          toast.error(`Stoo ya ${item.product.name} haijasasishwa: ${stockErr?.message || "Ruhusa imezuiwa"}`);
        }

        // Log activity
        logActivity({
          action: "sale_created",
          category: "sale",
          details: `Ameuzwa ${item.product.name} x${item.quantity} kwa ${formatTZS(item.lineTotal)}`,
          metadata: {
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            totalPrice: item.lineTotal,
            paymentMethod,
          },
        });
      }

      setProgress(100);
      toast.success(`Mauzo ${totalItems} yamerekodiwa!`);
      // Re-fetch products to sync stock
      dispatch(fetchProducts(currentShopId));
      setTimeout(() => {
        setDialogOpen(false);
        resetForm();
      }, 400);
    } catch (err: any) {
      toast.error(err?.message || "Imeshindikana kurekodi mauzo");
    }
    setSubmitting(false);
  };

  const filtered = sales.filter((s) => {
    const matchSearch = s.productName.toLowerCase().includes(search.toLowerCase()) ||
      (s.customerName?.toLowerCase() || "").includes(search.toLowerCase());
    const matchPayment = filterPayment === "all" || s.paymentMethod === filterPayment;
    return matchSearch && matchPayment;
  });

  const totalRevenue = filtered.reduce((sum, s) => sum + s.totalPrice, 0);

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Mauzo</h1>
          <p className="page-description">Rekodi na fuatilia mauzo yako</p>
        </div>
        {permissions.canAddSale && (
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button disabled={!currentShopId}><Plus className="h-4 w-4 mr-2" />Mauzo Mapya</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Rekodi Mauzo Mapya</DialogTitle></DialogHeader>
            {submitting && <Progress value={progress} className="h-1.5" />}

            {/* Add product to cart */}
            <div className="flex flex-wrap items-end gap-2 mt-4">
              <div className="flex-1 min-w-[180px]">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Bidhaa</label>
                <Select value={addProductId} onValueChange={setAddProductId}>
                  <SelectTrigger><SelectValue placeholder="Chagua bidhaa..." /></SelectTrigger>
                  <SelectContent>
                    {activeProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name} — Stoo: {p.stock}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-20">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Idadi</label>
                <Input type="number" min={1} value={addQty} onChange={(e) => setAddQty(Math.max(1, +e.target.value))} />
              </div>
              <Button type="button" onClick={addToCart} variant="secondary" size="default">
                <Plus className="h-4 w-4 mr-1" />Ongeza
              </Button>
            </div>

            {/* Cart Table */}
            {cart.length > 0 && (
              <div className="mt-4 rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-left text-muted-foreground">
                      <th className="px-3 py-2.5 font-medium">#</th>
                      <th className="px-3 py-2.5 font-medium">Bidhaa</th>
                      <th className="px-3 py-2.5 font-medium text-right">Bei</th>
                      <th className="px-3 py-2.5 font-medium text-center">Idadi</th>
                      <th className="px-3 py-2.5 font-medium text-right">Jumla</th>
                      <th className="px-3 py-2.5 font-medium w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => {
                      const discount = item.product.discount || 0;
                      const unitPrice = item.product.sellingPrice * (1 - discount / 100);
                      return (
                        <tr key={idx} className="border-t hover:bg-muted/30">
                          <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                          <td className="px-3 py-2 font-medium text-foreground">
                            {item.product.name}
                            {discount > 0 && <span className="ml-1 text-xs text-destructive">-{discount}%</span>}
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground">{formatTZS(Math.round(unitPrice))}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => updateCartQty(idx, item.quantity - 1)} className="rounded p-0.5 hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button onClick={() => updateCartQty(idx, item.quantity + 1)} className="rounded p-0.5 hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-foreground">{formatTZS(item.lineTotal)}</td>
                          <td className="px-3 py-2">
                            <button onClick={() => removeFromCart(idx)} className="rounded p-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted/50">
                      <td colSpan={4} className="px-3 py-3 text-right font-bold text-foreground">JUMLA:</td>
                      <td className="px-3 py-3 text-right text-lg font-extrabold text-primary">{formatTZS(cartTotal)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Payment & Customer Info */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Njia ya Malipo *</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Taslimu">Taslimu</SelectItem>
                      <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                      <SelectItem value="Tigo Pesa">Tigo Pesa</SelectItem>
                      <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                      <SelectItem value="Benki">Benki</SelectItem>
                      <SelectItem value="Mkopo">Mkopo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Jina la Mteja</label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Si lazima" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Simu</label>
                  <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Si lazima" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Maelezo</label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Si lazima" />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={cart.length === 0 || submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Inaendelea...</> : `Rekodi Mauzo — ${formatTZS(cartTotal)}`}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tafuta bidhaa, mteja..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Malipo Yote</SelectItem>
            <SelectItem value="Taslimu">Taslimu</SelectItem>
            <SelectItem value="M-Pesa">M-Pesa</SelectItem>
            <SelectItem value="Tigo Pesa">Tigo Pesa</SelectItem>
            <SelectItem value="Airtel Money">Airtel Money</SelectItem>
            <SelectItem value="Benki">Benki</SelectItem>
            <SelectItem value="Mkopo">Mkopo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!currentShopId ? (
        <div className="stat-card text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
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
                <th className="pb-3 font-medium">Bidhaa</th>
                <th className="pb-3 font-medium hidden sm:table-cell">Mteja</th>
                <th className="pb-3 font-medium text-right">Idadi</th>
                <th className="pb-3 font-medium text-right">Jumla</th>
                <th className="pb-3 font-medium">Malipo</th>
                <th className="pb-3 font-medium">Tarehe</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Hakuna mauzo bado</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 text-muted-foreground">{i + 1}</td>
                  <td className="py-3 font-medium">{s.productName}</td>
                  <td className="py-3 text-muted-foreground hidden sm:table-cell">{s.customerName || "—"}</td>
                  <td className="py-3 text-right">{s.quantity}</td>
                  <td className="py-3 text-right font-medium text-accent">{formatTZS(s.totalPrice)}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t pt-3 mt-2 text-xs text-muted-foreground">
            <span>Jumla: {filtered.length} mauzo</span>
            <span className="font-semibold text-foreground text-sm">{formatTZS(totalRevenue)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
