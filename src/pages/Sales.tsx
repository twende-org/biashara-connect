import { useEffect, useState } from "react";
import { Plus, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSales, createSale, createDraftSale, confirmDraft, deleteDraft, clearLastCompletedSale } from "@/store/salesSlice";
import { fetchProducts } from "@/store/productsSlice";
import { formatTZS } from "@/data/mockData";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import SaleCart, { type CartItem } from "@/components/sales/SaleCart";
import DraftSalesList from "@/components/sales/DraftSalesList";
import SaleReceipt from "@/components/sales/SaleReceipt";

export default function Sales() {
  const dispatch = useAppDispatch();
  const currentShopId = useAppSelector((s) => s.shops.currentShopId);
  const shops = useAppSelector((s) => s.shops.shops);
  const { permissions, role } = useUserRole();
  const { log: logActivity } = useActivityLogger();
  const { completedSales, draftSales, loading, lastCompletedSale } = useAppSelector((s) => s.sales);
  const products = useAppSelector((s) => s.products.products);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("completed");

  const currentShop = shops.find(s => s.id === currentShopId);

  useEffect(() => {
    if (currentShopId) {
      dispatch(fetchSales(currentShopId));
      dispatch(fetchProducts(currentShopId));
    }
  }, [currentShopId, dispatch]);

  // Show receipt when a sale is completed
  useEffect(() => {
    if (lastCompletedSale) {
      setReceiptOpen(true);
    }
  }, [lastCompletedSale]);

  const handleCartSubmit = async (
    cart: CartItem[], paymentMethod: string,
    customerName: string, customerPhone: string, notes: string,
    asDraft: boolean
  ) => {
    if (!currentShopId) return;

    for (const item of cart) {
      const saleData = {
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
      };

      if (asDraft) {
        await dispatch(createDraftSale({ ...saleData, status: "draft" })).unwrap();
      } else {
        const profit = (item.product.sellingPrice - item.product.buyingPrice) * item.quantity;
        await dispatch(createSale({ ...saleData, profit } as any)).unwrap();
      }

      logActivity({
        action: asDraft ? "draft_created" : "sale_created",
        category: "sale",
        details: asDraft
          ? `Draft: ${item.product.name} x${item.quantity} kwa ${formatTZS(item.lineTotal)}`
          : `Ameuzwa ${item.product.name} x${item.quantity} kwa ${formatTZS(item.lineTotal)}`,
        metadata: {
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          totalPrice: item.lineTotal,
          paymentMethod,
          isDraft: asDraft,
        },
      });
    }

    // Re-fetch products to sync stock (for completed sales)
    if (!asDraft) {
      dispatch(fetchProducts(currentShopId));
    }

    toast.success(asDraft ? `Draft ${cart.length} zimehifadhiwa` : `Mauzo ${cart.length} yamerekodiwa!`);
    setDialogOpen(false);
  };

  const handleConfirmDraft = async (sale: import("@/types").Sale) => {
    try {
      await dispatch(confirmDraft({ sale })).unwrap();
      if (currentShopId) dispatch(fetchProducts(currentShopId));
      toast.success(`Mauzo ya ${sale.productName} yamethibitishwa!`);
      logActivity({
        action: "draft_confirmed",
        category: "sale",
        details: `Draft imethibitishwa: ${sale.productName} x${sale.quantity} kwa ${formatTZS(sale.totalPrice)}`,
        metadata: { saleId: sale.id, productName: sale.productName },
      });
    } catch (err: any) {
      toast.error(err?.message || "Imeshindikana kuthibitisha draft");
    }
  };

  const handleDeleteDraft = async (sale: import("@/types").Sale) => {
    try {
      await dispatch(deleteDraft({ shopId: sale.shopId, date: sale.date, saleId: sale.id })).unwrap();
      toast.success("Draft imefutwa");
      logActivity({
        action: "draft_deleted",
        category: "sale",
        details: `Draft imefutwa: ${sale.productName}`,
        metadata: { saleId: sale.id },
      });
    } catch (err: any) {
      toast.error(err?.message || "Imeshindikana kufuta draft");
    }
  };

  const closeReceipt = () => {
    setReceiptOpen(false);
    dispatch(clearLastCompletedSale());
  };

  const filtered = completedSales.filter((s) => {
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!currentShopId}><Plus className="h-4 w-4 mr-2" />Mauzo Mapya</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Rekodi Mauzo Mapya</DialogTitle></DialogHeader>
              <SaleCart
                products={products}
                onSubmit={handleCartSubmit}
                canSaveDraft={permissions.canAddSale}
              />
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="completed">
              Mauzo Kamili
              {completedSales.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-[20px] text-xs">{completedSales.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Rasimu (Drafts)
              {draftSales.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-[20px] text-xs">{draftSales.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed">
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
          </TabsContent>

          <TabsContent value="drafts">
            <DraftSalesList
              drafts={draftSales}
              canConfirm={permissions.canConfirmDraft}
              canDelete={permissions.canDeleteDraft}
              onConfirm={handleConfirmDraft}
              onDelete={handleDeleteDraft}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Receipt Dialog */}
      <SaleReceipt
        sale={lastCompletedSale}
        shopName={currentShop?.name || "Duka"}
        open={receiptOpen}
        onClose={closeReceipt}
      />
    </div>
  );
}
