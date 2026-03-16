import { useRef } from "react";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTZS } from "@/data/mockData";
import type { Sale } from "@/types";

interface Props {
  sale: Sale | null;
  shopName: string;
  open: boolean;
  onClose: () => void;
}

export default function SaleReceipt({ sale, shopName, open, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!sale) return null;

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=320,height=600");
    if (!win) return;
    win.document.write(`
      <html><head><title>Risiti</title>
      <style>
        body { font-family: monospace; font-size: 12px; padding: 10px; max-width: 300px; margin: 0 auto; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; }
      </style></head><body>${content.innerHTML}</body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Risiti</span>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
          </DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="font-mono text-xs space-y-2 p-4 bg-muted/30 rounded-lg border">
          <div className="text-center">
            <p className="font-bold text-sm">{shopName}</p>
            <div className="border-t border-dashed border-muted-foreground my-2" />
            <p className="text-muted-foreground">RISITI YA MAUZO</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tarehe:</span>
              <span>{sale.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nambari:</span>
              <span className="uppercase">{sale.id.slice(0, 8)}</span>
            </div>
            {sale.customerName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mteja:</span>
                <span>{sale.customerName}</span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-muted-foreground my-2" />

          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Bidhaa</span>
              <span>Jumla</span>
            </div>
            <div className="flex justify-between">
              <span>{sale.productName} x{sale.quantity}</span>
              <span>{formatTZS(sale.totalPrice)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-muted-foreground my-2" />

          <div className="flex justify-between font-bold text-sm">
            <span>JUMLA:</span>
            <span>{formatTZS(sale.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Malipo:</span>
            <span>{sale.paymentMethod}</span>
          </div>

          <div className="border-t border-dashed border-muted-foreground my-2" />
          <p className="text-center text-muted-foreground">Asante kwa kununua!</p>
        </div>

        <Button onClick={handlePrint} className="w-full">
          <Printer className="h-4 w-4 mr-2" />Chapisha Risiti
        </Button>
      </DialogContent>
    </Dialog>
  );
}
