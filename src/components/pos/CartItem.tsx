"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { Minus, Plus, X } from "lucide-react";
import QuantityCalculatorDialog from "./QuantityCalculatorDialog";

interface Props {
  item: { productId: string; name: string; price: number; quantity: number; stock: number };
}

export default function CartItem({ item }: Props) {
  const { updateQty, removeItem } = useCartStore();
  const [calcOpen, setCalcOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 group transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate pr-1">
          {item.name}
        </p>
        <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">
          {item.price.toFixed(2)} MAD
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900/50 p-0.5 rounded-lg border border-zinc-150/40 dark:border-zinc-800/40">
        <button
          onClick={() => updateQty(item.productId, item.quantity - 1)}
          className="w-5.5 h-5.5 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-colors"
        >
          <Minus className="w-2.5 h-2.5" />
        </button>
        
        {/* Interactive Quantity Button */}
        <button
          onClick={() => setCalcOpen(true)}
          title="Adjust quantity via keypad"
          className="w-8 text-center text-xs font-extrabold text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-all select-none hover:scale-105 active:scale-95"
        >
          {item.quantity}
        </button>
        
        <button
          onClick={() => updateQty(item.productId, item.quantity + 1)}
          className="w-5.5 h-5.5 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-colors"
        >
          <Plus className="w-2.5 h-2.5" />
        </button>
      </div>

      <span className="text-xs font-bold w-16 text-right text-zinc-800 dark:text-zinc-200 tracking-tight">
        {(item.price * item.quantity).toFixed(2)}
      </span>

      <button
        onClick={() => removeItem(item.productId)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-650 dark:text-zinc-550 dark:hover:text-red-400 p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Numeric Calculator Keypad */}
      <QuantityCalculatorDialog
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        productName={item.name}
        initialQuantity={item.quantity}
        stock={item.stock}
        onConfirm={(newQty) => updateQty(item.productId, newQty)}
      />
    </div>
  );
}