import { useState } from "react";
import { Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatTZS } from "@/data/mockData";
import { toast } from "sonner";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

interface Props {
  products: Product[];
  onSubmit: (cart: CartItem[], paymentMethod: string, customerName: string, customerPhone: string, notes: string, asDraft: boolean) => Promise<void>;
  canSaveDraft: boolean;
}

export default function SaleCart({ products, onSubmit, canSaveDraft }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addProductId, setAddProductId] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Taslimu");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleSubmit = async (asDraft: boolean) => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setProgress(30);
    try {
      await onSubmit(cart, paymentMethod, customerName, customerPhone, notes, asDraft);
      setProgress(100);
      setTimeout(() => resetForm(), 300);
    } catch (err: any) {
      toast.error(err?.message || "Imeshindikana kurekodi mauzo");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {submitting && <Progress value={progress} className="h-1.5" />}

      {/* Add product to cart */}
      <div className="flex flex-wrap items-end gap-2">
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
        <Button type="button" onClick={addToCart} variant="secondary">
          <Plus className="h-4 w-4 mr-1" />Ongeza
        </Button>
      </div>

      {/* Cart Table */}
      {cart.length > 0 && (
        <div className="rounded-lg border overflow-hidden">
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
      <div className="space-y-4">
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

        <div className="flex gap-2">
          <Button onClick={() => handleSubmit(false)} className="flex-1" size="lg" disabled={cart.length === 0 || submitting}>
            {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Inaendelea...</> : `Rekodi Mauzo — ${formatTZS(cartTotal)}`}
          </Button>
          {canSaveDraft && (
            <Button onClick={() => handleSubmit(true)} variant="outline" size="lg" disabled={cart.length === 0 || submitting}>
              Hifadhi Draft
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
