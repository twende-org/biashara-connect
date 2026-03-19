import { useEffect, useState, useRef } from "react";
import { Plus, Search, Edit, Trash2, Package, Eye, ChevronDown, ChevronUp, Loader2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, createProduct, editProduct, removeProduct } from "@/store/productsSlice";
import { formatTZS } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useUserRole } from "@/hooks/useUserRole";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { useI18n } from "@/lib/i18n";

const defaultForm = {
  name: "", category: "", buyingPrice: 0, sellingPrice: 0, stock: 0, minStock: 0,
  supplier: "", sku: "", barcode: "", brand: "", description: "", unit: "pcs",
  weight: "", size: "", color: "", expiryDate: "", status: "active" as "active" | "inactive" | "discontinued",
  tags: "", warranty: "", discount: 0, taxRate: 0, imageUrl: "",
};

const units = ["pcs", "kg", "g", "litre", "ml", "box", "pack", "metre", "dozen", "pair", "set", "roll", "bag"];
const categories = [
  "Vifaa vya Simu", "Elektroniki", "Kompyuta", "Nguo & Viatu", "Vyakula & Vinywaji",
  "Vipodozi", "Dawa", "Vifaa vya Nyumba", "Vifaa vya Shule", "Spare Parts",
  "Vifaa vya Ujenzi", "Kilimo", "Michezo", "Nyingine",
];

export default function Products() {
  const dispatch = useAppDispatch();
  const currentShopId = useAppSelector((s) => s.shops.currentShopId);
  const { permissions } = useUserRole();
  const { log: logActivity } = useActivityLogger();
  const { products, loading } = useAppSelector((s) => s.products);
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error(t("products.imageOnly")); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error(t("products.imageMaxSize")); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setForm((f) => ({ ...f, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm((f) => ({ ...f, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (currentShopId) dispatch(fetchProducts(currentShopId));
  }, [currentShopId, dispatch]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.barcode?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.brand?.toLowerCase() || "").includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || p.category === filterCategory;
    const matchStatus = filterStatus === "all" || (p.status || "active") === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const resetForm = () => { setForm(defaultForm); setShowAdvanced(false); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShopId) { toast.error(t("products.selectShop")); return; }
    setSubmitting(true);
    setProgress(30);
    try {
      // Remove empty optional fields before saving
      const raw = { ...form };
      const data = Object.fromEntries(
        Object.entries(raw).filter(([_, v]) => v !== "" && v !== 0 && v !== undefined)
      ) as typeof raw;
      // Always keep required numeric fields
      data.buyingPrice = raw.buyingPrice;
      data.sellingPrice = raw.sellingPrice;
      data.stock = raw.stock;
      data.minStock = raw.minStock;
      setProgress(60);
      if (editingProduct) {
        await dispatch(editProduct({ id: editingProduct.id, data })).unwrap();
        logActivity({ action: "product_updated", category: "product", details: `${data.name}`, metadata: { productId: editingProduct.id } });
        toast.success(t("products.updated"));
      } else {
        await dispatch(createProduct({ ...data, shopId: currentShopId })).unwrap();
        logActivity({ action: "product_created", category: "product", details: `${data.name}`, metadata: { name: data.name, stock: data.stock } });
        toast.success(t("products.added"));
      }
      setProgress(100);
      setTimeout(() => {
        setDialogOpen(false);
        setEditingProduct(null);
        resetForm();
        setProgress(0);
      }, 300);
    } catch (err: any) {
      toast.error(err?.message || t("products.failed"));
    }
    setSubmitting(false);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name, category: p.category, buyingPrice: p.buyingPrice, sellingPrice: p.sellingPrice,
      stock: p.stock, minStock: p.minStock, supplier: p.supplier,
      sku: p.sku || "", barcode: p.barcode || "", brand: p.brand || "",
      description: p.description || "", unit: p.unit || "pcs", weight: p.weight || "",
      size: p.size || "", color: p.color || "", expiryDate: p.expiryDate || "",
      status: p.status || "active", tags: p.tags || "", warranty: p.warranty || "",
      discount: p.discount || 0, taxRate: p.taxRate || 0, imageUrl: p.imageUrl || "",
    });
    setShowAdvanced(true);
    setImagePreview(p.imageUrl || null);
    setDialogOpen(true);
  };

  const profit = (p: Product) => p.sellingPrice - p.buyingPrice;
  const profitMargin = (p: Product) => p.buyingPrice > 0 ? ((profit(p) / p.buyingPrice) * 100).toFixed(0) : "0";

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">{t("products.title")}</h1>
          <p className="page-description">{t("products.subtitle")}</p>
        </div>
        {permissions.canAddProduct && (
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setEditingProduct(null); resetForm(); setProgress(0); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t("products.add")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? t("products.editTitle") : t("products.addTitle")}</DialogTitle>
            </DialogHeader>
            {submitting && <Progress value={progress} className="h-1" />}
            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("products.name")} *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("products.brand")}</label>
                  <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="mfano: Samsung, Nike" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("products.category")} *</label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Chagua aina..." /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("products.unit")}</label>
                  <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("products.buyingPrice")} *</label>
                  <Input type="number" value={form.buyingPrice} onChange={(e) => setForm({ ...form, buyingPrice: +e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("products.sellingPrice")} *</label>
                  <Input type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: +e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("products.stock")} *</label>
                  <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("products.minStock")} *</label>
                  <Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: +e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("products.supplier")}</label>
                <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Picha ya Bidhaa</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview || form.imageUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview || form.imageUrl}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover border-2 border-border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1 shadow-md hover:opacity-80 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 text-xs text-primary hover:underline block"
                    >
                      Badilisha picha
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 w-full rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 bg-muted/30 p-4 transition-colors cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ImagePlus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Bonyeza kuchagua picha</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG hadi 5MB</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Advanced toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showAdvanced ? "Ficha maelezo zaidi" : "Onyesha maelezo zaidi"}
              </button>

              {showAdvanced && (
                <div className="space-y-3 border-t pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">SKU</label>
                      <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="mfano: PRD-001" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Barcode</label>
                      <Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} placeholder="mfano: 8901234567890" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Uzito</label>
                      <Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="mfano: 500g" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Ukubwa / Size</label>
                      <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="mfano: XL, 42" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Rangi</label>
                      <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="mfano: Nyeusi" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Tarehe ya Kuisha</label>
                      <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Hali</label>
                      <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Inapatikana</SelectItem>
                          <SelectItem value="inactive">Haipo</SelectItem>
                          <SelectItem value="discontinued">Imesitishwa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Punguzo % (Discount)</label>
                      <Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: +e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Kodi % (Tax)</label>
                      <Input type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: +e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Dhamana / Warranty</label>
                    <Input value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} placeholder="mfano: Miezi 6" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Tags (tenganisha kwa koma)</label>
                    <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="mfano: mpya, maarufu, offer" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Maelezo</label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Inaendelea...</> : (editingProduct ? "Sasisha" : "Ongeza")}
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
          <Input placeholder="Tafuta jina, SKU, barcode, brand..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Aina..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Aina Zote</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Hali..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hali Zote</SelectItem>
            <SelectItem value="active">Inapatikana</SelectItem>
            <SelectItem value="inactive">Haipo</SelectItem>
            <SelectItem value="discontinued">Imesitishwa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product detail dialog */}
      <Dialog open={!!detailProduct} onOpenChange={(v) => { if (!v) setDetailProduct(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Maelezo ya Bidhaa</DialogTitle></DialogHeader>
          {detailProduct && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Jina:</span><span className="font-medium">{detailProduct.name}</span></div>
              {detailProduct.brand && <div className="flex justify-between"><span className="text-muted-foreground">Brand:</span><span>{detailProduct.brand}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Aina:</span><span>{detailProduct.category}</span></div>
              {detailProduct.sku && <div className="flex justify-between"><span className="text-muted-foreground">SKU:</span><span>{detailProduct.sku}</span></div>}
              {detailProduct.barcode && <div className="flex justify-between"><span className="text-muted-foreground">Barcode:</span><span>{detailProduct.barcode}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Bei Kununua:</span><span>{formatTZS(detailProduct.buyingPrice)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Bei Kuuza:</span><span>{formatTZS(detailProduct.sellingPrice)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Faida:</span><span className="text-accent font-medium">{formatTZS(profit(detailProduct))} ({profitMargin(detailProduct)}%)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stoo:</span><span className={cn(detailProduct.stock <= detailProduct.minStock ? "text-destructive" : "text-accent", "font-medium")}>{detailProduct.stock} {detailProduct.unit || "pcs"}</span></div>
              {detailProduct.weight && <div className="flex justify-between"><span className="text-muted-foreground">Uzito:</span><span>{detailProduct.weight}</span></div>}
              {detailProduct.size && <div className="flex justify-between"><span className="text-muted-foreground">Ukubwa:</span><span>{detailProduct.size}</span></div>}
              {detailProduct.color && <div className="flex justify-between"><span className="text-muted-foreground">Rangi:</span><span>{detailProduct.color}</span></div>}
              {detailProduct.expiryDate && <div className="flex justify-between"><span className="text-muted-foreground">Tarehe Kuisha:</span><span>{detailProduct.expiryDate}</span></div>}
              {detailProduct.warranty && <div className="flex justify-between"><span className="text-muted-foreground">Dhamana:</span><span>{detailProduct.warranty}</span></div>}
              {detailProduct.discount ? <div className="flex justify-between"><span className="text-muted-foreground">Punguzo:</span><span>{detailProduct.discount}%</span></div> : null}
              {detailProduct.supplier && <div className="flex justify-between"><span className="text-muted-foreground">Msambazaji:</span><span>{detailProduct.supplier}</span></div>}
              {detailProduct.description && <div className="border-t pt-2"><span className="text-muted-foreground block mb-1">Maelezo:</span><p>{detailProduct.description}</p></div>}
              {detailProduct.tags && <div className="flex flex-wrap gap-1">{detailProduct.tags.split(",").map((t, i) => <span key={i} className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs">{t.trim()}</span>)}</div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {!currentShopId ? (
        <div className="stat-card text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Ongeza duka kwanza ili kuona bidhaa</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" /></div>
      ) : (
        <div className="stat-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Bidhaa</th>
                <th className="pb-3 font-medium hidden sm:table-cell">Aina</th>
                <th className="pb-3 font-medium hidden md:table-cell">Brand</th>
                <th className="pb-3 font-medium text-right">Bei Kuuza</th>
                <th className="pb-3 font-medium text-right">Faida</th>
                <th className="pb-3 font-medium text-right">Stoo</th>
                <th className="pb-3 font-medium text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Hakuna bidhaa bado</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3">
                    <div className="font-medium">{p.name}</div>
                    {p.sku && <div className="text-xs text-muted-foreground">SKU: {p.sku}</div>}
                  </td>
                  <td className="py-3 text-muted-foreground hidden sm:table-cell">{p.category}</td>
                  <td className="py-3 text-muted-foreground hidden md:table-cell">{p.brand || "-"}</td>
                  <td className="py-3 text-right">{formatTZS(p.sellingPrice)}</td>
                  <td className="py-3 text-right text-accent">{formatTZS(profit(p))}</td>
                  <td className="py-3 text-right">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", p.stock <= p.minStock ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent")}>
                      {p.stock} {p.unit || "pcs"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setDetailProduct(p)} className="rounded-lg p-1.5 hover:bg-muted transition-colors" title="Angalia">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {permissions.canEditProduct && (
                        <button onClick={() => handleEdit(p)} className="rounded-lg p-1.5 hover:bg-muted transition-colors" title="Hariri">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                      {permissions.canDeleteProduct && (
                        <button onClick={() => { dispatch(removeProduct(p.id)); toast.success("Bidhaa imefutwa!"); }} className="rounded-lg p-1.5 hover:bg-destructive/10 transition-colors" title="Futa">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t pt-3 mt-2 text-xs text-muted-foreground">
            <span>Jumla: {filtered.length} bidhaa</span>
            <span>Thamani ya Stoo: {formatTZS(filtered.reduce((sum, p) => sum + p.sellingPrice * p.stock, 0))}</span>
          </div>
        </div>
      )}
    </div>
  );
}
