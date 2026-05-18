"use client";
import { useState, useRef } from "react";
import { useCartStore } from "@/store/cart.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Banknote, CreditCard, Smartphone, CheckCircle } from "lucide-react";
import { Order } from "@/types";
import { useReactToPrint } from "react-to-print";
import Receipt from "./Receipt";

const METHODS = [
  { value: "CASH",     label: "Cash",     icon: Banknote },
  { value: "CARD",     label: "Card",     icon: CreditCard },
  { value: "TRANSFER", label: "Transfer", icon: Smartphone },
];

interface Props {
  open:    boolean;
  onClose: () => void;
  total:   number;
  tax:     number;
}

export default function PaymentDialog({ open, onClose, total, tax }: Props) {
  const { items, discount, subtotal, clearCart } = useCartStore();
  const [method,         setMethod]         = useState("CASH");
  const [amountPaid,     setAmountPaid]     = useState<number>(total);
  const [loading,        setLoading]        = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${completedOrder?.orderNumber}`,
  });

  const change = Math.max(0, amountPaid - total);

  function handleClose() {
    setCompletedOrder(null);
    setMethod("CASH");
    setAmountPaid(total);
    onClose();
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId,
            quantity:  i.quantity,
            unitPrice: i.price,
          })),
          subtotal:      subtotal(),
          discount,
          tax,
          total,
          paymentMethod: method,
          amountPaid,
          change,
          cashierId: "REPLACE_WITH_SESSION_USER_ID",
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const data: Order = await res.json();
      setCompletedOrder(data);
      clearCart();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {completedOrder ? "Receipt" : "Payment"}
          </DialogTitle>
        </DialogHeader>

        {completedOrder ? (
          // ── Receipt screen ──────────────────────────────────────
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5" />
              <span>Payment Successful</span>
            </div>

            {/* Hidden printable receipt */}
            <div className="hidden">
              <Receipt ref={receiptRef} order={completedOrder} />
            </div>

            {/* Visible receipt preview */}
            <div className="border rounded-xl overflow-auto max-h-[400px] flex justify-center bg-white">
              <Receipt ref={receiptRef} order={completedOrder} />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Close
              </Button>
              <Button className="flex-1" onClick={() => handlePrint()}>
                Print Receipt
              </Button>
            </div>
          </div>
        ) : (
          // ── Payment form ────────────────────────────────────────
          <div className="space-y-4">
            {/* Method selector */}
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMethod(m.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm font-medium transition-colors
                    ${method === m.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"}`}
                >
                  <m.icon className="w-5 h-5" />
                  {m.label}
                </button>
              ))}
            </div>

            {/* Total */}
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Due</p>
              <p className="text-3xl font-bold">{total.toFixed(2)} MAD</p>
            </div>

            {/* Cash amount */}
            {method === "CASH" && (
              <div className="space-y-1">
                <Label>Amount Received</Label>
                <Input
                  type="number"
                  min={total}
                  value={amountPaid}
                  onChange={e => setAmountPaid(Number(e.target.value))}
                  className="text-right text-lg font-semibold"
                />
                {change > 0 && (
                  <p className="text-sm text-green-600 font-medium text-right">
                    Change: {change.toFixed(2)} MAD
                  </p>
                )}
              </div>
            )}

            <Button
              className="w-full h-12 text-base"
              onClick={handleConfirm}
              disabled={loading || (method === "CASH" && amountPaid < total)}
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}