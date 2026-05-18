"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Banknote, CreditCard, Smartphone } from "lucide-react";

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
  const [method,    setMethod]    = useState("CASH");
  const [amountPaid, setAmountPaid] = useState<number>(total);
  const [loading,   setLoading]   = useState(false);

  const change = Math.max(0, amountPaid - total);

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
          cashierId: "REPLACE_WITH_SESSION_USER_ID", // swap with session later
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      toast.success("Order completed!");
      clearCart();
      onClose();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Method */}
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

          {/* Amount paid (cash only) */}
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
      </DialogContent>
    </Dialog>
  );
}