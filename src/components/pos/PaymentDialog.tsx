"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cart.store";
import { Order } from "@/types";
import { Banknote, CheckCircle, Check, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import Receipt from "./Receipt";
import { useSession } from "next-auth/react";

const STANDARD_BILLS = [10, 20, 50, 100, 200];

interface Props {
  open: boolean;
  onClose: () => void;
  total: number;
  tax: number;
}

export default function PaymentDialog({ open, onClose, total, tax }: Props) {
  const { items, discount, subtotal, clearCart } = useCartStore();
  const [amountPaid, setAmountPaid] = useState<number>(total);
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  // Reset payment amount when total changes or dialog opens
  useEffect(() => {
    if (open) {
      setAmountPaid(total);
    }
  }, [open, total]);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${completedOrder?.orderNumber}`,
  });

  const change = Math.max(0, amountPaid - total);

  function handleClose() {
    setCompletedOrder(null);
    setAmountPaid(total);
    onClose();
  }

  // Smart "Next Bill" helper
  const getNextBill = () => {
    for (const bill of STANDARD_BILLS) {
      if (bill >= total) return bill;
    }
    return Math.ceil(total / 50) * 50;
  };

  const nextBill = getNextBill();

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
          subtotal: subtotal(),
          discount,
          tax,
          total,
          paymentMethod: "CASH",
          amountPaid,
          change,
          cashierId: session?.user.id ?? "",  
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
      <DialogContent className="max-w-[380px] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 gap-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {completedOrder ? "Order Receipt" : "Cash Checkout"}
          </DialogTitle>
        </DialogHeader>

        {completedOrder ? (
          // ── Receipt screen ──────────────────────────────────────
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <CheckCircle className="w-4 h-4 animate-bounce" />
              <span>Payment Successful</span>
            </div>

            {/* Hidden printable receipt */}
            <div className="hidden">
              <Receipt ref={receiptRef} order={completedOrder} />
            </div>

            {/* Visible receipt preview */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-auto max-h-[360px] flex justify-center bg-white p-2">
              <Receipt ref={receiptRef} order={completedOrder} />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 h-9 text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                onClick={handleClose}
              >
                Close Dialog
              </Button>
              <Button
                className="flex-1 h-9 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-sm"
                onClick={() => handlePrint()}
              >
                Print Receipt
              </Button>
            </div>
          </div>
        ) : (
          // ── Payment form ────────────────────────────────────────
          <div className="space-y-4 pt-1">
            {/* Total display box */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase mb-0.5">
                Total Due
              </p>
              <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight font-mono">
                {total.toFixed(2)}
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 ml-1.5">MAD</span>
              </p>
            </div>

            {/* Cash amount controls rendered directly */}
            <div className="space-y-3.5">
              {/* Cash Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Amount Tendered</Label>
                  {amountPaid < total && (
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
                      Underpaid
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={amountPaid === 0 ? "" : amountPaid}
                    onChange={e => setAmountPaid(Number(e.target.value))}
                    className="text-right text-lg font-extrabold font-mono h-11 pr-10 border-zinc-200 dark:border-zinc-850"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 dark:text-zinc-500 font-mono select-none">
                    MAD
                  </span>
                </div>
              </div>

              {/* Smart cash drawers / bills quick keys */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase block">
                  Quick Cash Helper
                </span>
                
                {/* Row 1: Logical actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAmountPaid(total)}
                    className="h-8.5 text-xs font-extrabold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 gap-1.5 shadow-none"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Exact Amount
                  </Button>

                  {nextBill !== total && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAmountPaid(nextBill)}
                      className="h-8.5 text-xs font-extrabold border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 bg-amber-50/20 dark:bg-amber-950/10 hover:bg-amber-50 dark:hover:bg-amber-950/20 gap-1 hover:border-amber-400/50 dark:hover:border-amber-800/50 shadow-none"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      Next Bill ({nextBill} MAD)
                    </Button>
                  )}
                </div>

                {/* Row 2: Standard Currency Bills */}
                <div className="flex flex-wrap gap-1.5">
                  {STANDARD_BILLS.map(bill => {
                    // Only show bill if it's logical (close to or greater than total / 2)
                    if (bill < total * 0.4 && bill !== 10) return null;
                    return (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => setAmountPaid(bill)}
                        className="flex-1 min-w-[54px] h-8 text-[11px] font-extrabold border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors shadow-2xs select-none"
                      >
                        {bill} MAD
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Change indicator banner */}
              {amountPaid >= total && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 transition-all animate-fade-in-up">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Change Due</span>
                  <span className="text-xl font-extrabold font-mono tracking-tight">
                    {change.toFixed(2)}
                    <span className="text-xs font-bold ml-1">MAD</span>
                  </span>
                </div>
              )}
            </div>

            <Button
              className="w-full h-11 text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-sm mt-2"
              onClick={handleConfirm}
              disabled={loading || amountPaid < total}
            >
              {loading ? "Processing Order..." : "Confirm Payment"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
