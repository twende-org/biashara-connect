import { useRef, useState } from "react";
import { X, Printer, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTZS } from "@/data/mockData";
import { openWhatsApp, shareWhatsApp, buildReceiptMessage, buildOrderNotification } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n";
import type { Sale } from "@/types";

interface Props {
  sale: Sale | null;
  shopName: string;
  open: boolean;
  onClose: () => void;
}

const RECEIPT_STYLES = `
  @page { margin: 0; size: 58mm 109mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Courier New', monospace;
    font-size: 10px;
    line-height: 1.3;
    width: 58mm;
    max-width: 58mm;
    padding: 3mm 2mm;
    color: #000;
    background: #fff;
  }
  .shop-name { font-size: 13px; font-weight: 800; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; }
  .subtitle { font-size: 9px; text-align: center; color: #444; margin-top: 1px; }
  .divider { border: none; border-top: 1px dashed #000; margin: 4px 0; }
  .divider-double { border: none; border-top: 2px solid #000; margin: 4px 0; }
  .label-row { display: flex; justify-content: space-between; font-size: 9px; }
  .label-row .label { color: #555; }
  .header-row { display: flex; justify-content: space-between; font-size: 9px; font-weight: 700; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 2px; }
  .item-row { display: flex; justify-content: space-between; font-size: 9.5px; padding: 1px 0; }
  .total-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: 900; padding: 3px 0; }
  .payment-row { display: flex; justify-content: space-between; font-size: 9px; }
  .footer { text-align: center; font-size: 8px; color: #555; margin-top: 3px; }
  .footer-thanks { text-align: center; font-size: 10px; font-weight: 700; margin-top: 2px; }
  .receipt-no { font-family: monospace; font-size: 8px; text-align: center; color: #777; letter-spacing: 1px; }
`;

export default function SaleReceipt({ sale, shopName, open, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const [waPhone, setWaPhone] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  if (!sale) return null;

  const receiptNo = sale.id.slice(0, 8).toUpperCase();
  const dateObj = new Date(sale.date);
  const formattedDate = dateObj.toLocaleDateString("sw-TZ", { day: "2-digit", month: "2-digit", year: "numeric" });
  const formattedTime = new Date().toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" });
  const unitPrice = sale.quantity > 0 ? sale.totalPrice / sale.quantity : sale.totalPrice;

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=240,height=450");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Risiti</title><style>${RECEIPT_STYLES}</style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const handleShareWhatsApp = () => {
    const msg = buildReceiptMessage(sale, shopName);
    if (sale.customerPhone) {
      openWhatsApp(sale.customerPhone, msg);
    } else {
      shareWhatsApp(msg);
    }
  };

  const handleSendToPhone = () => {
    if (!waPhone.trim()) return;
    const msg = buildReceiptMessage(sale, shopName);
    openWhatsApp(waPhone, msg);
    setWaPhone("");
    setShowPhoneInput(false);
  };

  const handleNotifyCustomer = () => {
    if (!sale.customerPhone) return;
    const msg = buildOrderNotification(sale, shopName);
    openWhatsApp(sale.customerPhone, msg);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xs p-3">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-sm">
            <span>Risiti</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-3 w-3" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Receipt preview — styled to mimic 58mm thermal */}
        <div
          ref={receiptRef}
          className="mx-auto bg-white text-black rounded border shadow-inner overflow-hidden"
          style={{ width: "58mm", minHeight: "109mm", padding: "3mm 2mm", fontFamily: "'Courier New', monospace", fontSize: "10px", lineHeight: 1.3 }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {shopName}
            </div>
            <div style={{ fontSize: "9px", color: "#444", marginTop: "1px" }}>RISITI YA MAUZO</div>
          </div>
          <hr style={{ border: "none", borderTop: "2px solid #000", margin: "4px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
              <span style={{ color: "#555" }}>Tarehe:</span>
              <span>{formattedDate} {formattedTime}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
              <span style={{ color: "#555" }}>Nambari:</span>
              <span style={{ fontFamily: "monospace", letterSpacing: "1px" }}>{receiptNo}</span>
            </div>
            {sale.customerName && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
                <span style={{ color: "#555" }}>Mteja:</span>
                <span>{sale.customerName}</span>
              </div>
            )}
          </div>
          <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "4px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "2px" }}>
            <span>Bidhaa</span>
            <span>Jumla</span>
          </div>
          <div style={{ padding: "2px 0" }}>
            <div style={{ fontSize: "9.5px", fontWeight: 600 }}>{sale.productName}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#333" }}>
              <span>{sale.quantity} x {formatTZS(unitPrice)}</span>
              <span style={{ fontWeight: 600 }}>{formatTZS(sale.totalPrice)}</span>
            </div>
          </div>
          <hr style={{ border: "none", borderTop: "2px solid #000", margin: "4px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 900, padding: "2px 0" }}>
            <span>JUMLA</span>
            <span>{formatTZS(sale.totalPrice)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", marginTop: "2px" }}>
            <span style={{ color: "#555" }}>Malipo:</span>
            <span>{sale.paymentMethod}</span>
          </div>
          <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "5px 0 3px" }} />
          <div style={{ textAlign: "center", fontSize: "10px", fontWeight: 700 }}>Asante kwa kununua!</div>
          <div style={{ textAlign: "center", fontSize: "8px", color: "#777", marginTop: "2px" }}>
            Powered by DukSmart POS
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-2">
          <Button onClick={handlePrint} className="w-full" size="sm">
            <Printer className="h-4 w-4 mr-2" />Chapisha Risiti
          </Button>

          <Button onClick={handleShareWhatsApp} variant="secondary" size="sm" className="w-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30">
            <MessageCircle className="h-4 w-4 mr-2" />
            {sale.customerPhone ? t("whatsapp.sendToCustomer") : t("whatsapp.shareReceipt")}
          </Button>

          {sale.customerPhone && (
            <Button onClick={handleNotifyCustomer} variant="outline" size="sm" className="w-full">
              <Send className="h-4 w-4 mr-2" />{t("whatsapp.notifyCustomer")}
            </Button>
          )}

          {!sale.customerPhone && (
            <>
              {showPhoneInput ? (
                <div className="flex gap-2">
                  <Input
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder={t("whatsapp.enterPhone")}
                    className="text-xs h-8"
                  />
                  <Button onClick={handleSendToPhone} size="sm" className="h-8 px-3 bg-[#25D366] hover:bg-[#25D366]/90 text-white">
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPhoneInput(true)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  {t("whatsapp.enterPhone")}
                </button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
