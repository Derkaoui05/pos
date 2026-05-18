"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import CartItem from "./CartItem";
import PaymentDialog from "./PaymentDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2 } from "lucide-react";

export default function Cart() {
  const { items, discount, setDiscount, clearCart, subtotal, total } = useCartStore();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const tax = total() * 0.20; // 20% VAT — adjust as needed

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2 font-semibold">
          <ShoppingCart className="w-4 h-4" />
          <span>Cart</span>
          {items.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {items.length}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <button onClick={clearCart} className="text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <ShoppingCart className="w-10 h-10 opacity-20" />
            <span className="text-sm">Cart is empty</span>
          </div>
        ) : (
          items.map(item => <CartItem key={item.productId} item={item} />)
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="p-4 border-t space-y-3">
          {/* Discount */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground flex-1">Discount (MAD)</span>
            <Input
              type="number"
              min={0}
              value={discount || ""}
              onChange={e => setDiscount(Number(e.target.value))}
              className="w-24 h-8 text-right text-sm"
              placeholder="0"
            />
          </div>

          <Separator />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{subtotal().toFixed(2)} MAD</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- {discount.toFixed(2)} MAD</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (20%)</span>
              <span>{tax.toFixed(2)} MAD</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{(total() + tax).toFixed(2)} MAD</span>
          </div>

          <Button className="w-full h-12 text-base" onClick={() => setPaymentOpen(true)}>
            Charge {(total() + tax).toFixed(2)} MAD
          </Button>
        </div>
      )}

      <PaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={total() + tax}
        tax={tax}
      />
    </div>
  );
}