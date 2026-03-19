import { useState } from "react";
import { CheckCircle2, Trash2, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTZS } from "@/data/mockData";
import type { Sale } from "@/types";
import { useI18n } from "@/lib/i18n";

interface Props {
  drafts: Sale[];
  canConfirm: boolean;
  canDelete: boolean;
  onConfirm: (sale: Sale) => Promise<void>;
  onDelete: (sale: Sale) => Promise<void>;
}

export default function DraftSalesList({ drafts, canConfirm, canDelete, onConfirm, onDelete }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { t } = useI18n();

  const handleConfirm = async (sale: Sale) => { setLoadingId(sale.id); try { await onConfirm(sale); } finally { setLoadingId(null); } };
  const handleDelete = async (sale: Sale) => { setLoadingId(sale.id); try { await onDelete(sale); } finally { setLoadingId(null); } };

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">{t("sales.noDrafts")}</p>
      </div>
    );
  }

  return (
    <div className="stat-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-3 font-medium">#</th>
            <th className="pb-3 font-medium">{t("sales.product")}</th>
            <th className="pb-3 font-medium hidden sm:table-cell">{t("sales.customer")}</th>
            <th className="pb-3 font-medium text-right">{t("sales.quantity")}</th>
            <th className="pb-3 font-medium text-right">{t("sales.total")}</th>
            <th className="pb-3 font-medium">{t("sales.payment")}</th>
            <th className="pb-3 font-medium">{t("sales.status")}</th>
            <th className="pb-3 font-medium text-right">{t("products.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((s, i) => (
            <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="py-3 text-muted-foreground">{i + 1}</td>
              <td className="py-3 font-medium">{s.productName}</td>
              <td className="py-3 text-muted-foreground hidden sm:table-cell">{s.customerName || "—"}</td>
              <td className="py-3 text-right">{s.quantity}</td>
              <td className="py-3 text-right font-medium">{formatTZS(s.totalPrice)}</td>
              <td className="py-3"><span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{s.paymentMethod}</span></td>
              <td className="py-3"><Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Draft</Badge></td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {canConfirm && (
                    <Button size="sm" variant="default" disabled={loadingId === s.id} onClick={() => handleConfirm(s)} className="h-7 text-xs">
                      {loadingId === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><CheckCircle2 className="h-3 w-3 mr-1" />{t("sales.confirm")}</>}
                    </Button>
                  )}
                  {canDelete && (
                    <Button size="sm" variant="ghost" disabled={loadingId === s.id} onClick={() => handleDelete(s)} className="h-7 text-xs text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}