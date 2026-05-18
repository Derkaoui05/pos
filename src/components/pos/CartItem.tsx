"use client";
import { useCartStore } from "@/store/cart.store";
import { Minus, Plus, X } from "lucide-react";

interface Props {
  item: { productId: string; name: string; price: number; quantity: number };
}

export default function CartItem({ item }: Props) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.price.toFixed(2)} MAD</p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQty(item.productId, item.quantity - 1)}
          className="w-6 h-6 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQty(item.productId, item.quantity + 1)}
          className="w-6 h-6 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <span className="text-sm font-semibold w-16 text-right">
        {(item.price * item.quantity).toFixed(2)}
      </span>

      <button
        onClick={() => removeItem(item.productId)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}