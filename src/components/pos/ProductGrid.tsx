"use client";
import { useCartStore } from "@/store/cart.store";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Store } from "lucide-react";

export default function ProductGrid({ products }: { products: Product[] }) {
  const addItem = useCartStore(s => s.addItem);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
      {products.map(p => (
        <button
          key={p.id}
          onClick={() => addItem({ productId: p.id, name: p.name, price: p.price })}
          disabled={p.stock === 0}
          className="group relative flex flex-col items-start p-3.5 rounded-2xl border border-zinc-200 bg-white
            dark:border-zinc-800/80 dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20
            hover:border-zinc-900 dark:hover:border-zinc-100 hover:shadow-md hover:-translate-y-0.5
            transition-all duration-300 text-left disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {/* Image container */}
          <div className="w-full aspect-square rounded-xl bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center mb-3.5 overflow-hidden border border-zinc-100/50 dark:border-zinc-800/30">
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1.5 text-zinc-300 dark:text-zinc-700">
                <Store className="h-7 w-7" />
                <span className="text-[9px] font-bold uppercase tracking-wider">No Image</span>
              </div>
            )}
          </div>

          {/* Product details */}
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2 min-h-[2.5rem] mb-1.5">
            {p.name}
          </span>
          
          <div className="flex items-baseline justify-between w-full mt-auto">
            <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {p.price.toFixed(2)}
              <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 ml-1">MAD</span>
            </span>
          </div>

          {/* Elegant top badge */}
          <Badge
            variant={p.stock > 10 ? "secondary" : p.stock > 0 ? "outline" : "destructive"}
            className={`text-[9px] font-bold uppercase tracking-wider absolute top-2 right-2 px-2 py-0.5 border-transparent shadow-none
              ${p.stock > 10 
                ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" 
                : p.stock > 0 
                  ? "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400" 
                  : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"}`}
          >
            {p.stock > 0 ? `${p.stock} left` : "Out of Stock"}
          </Badge>
        </button>
      ))}

      {products.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center h-48 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-400 dark:text-zinc-600 text-sm font-medium gap-2">
          <Store className="h-8 w-8 opacity-40 animate-pulse" />
          <span>No products found in this category</span>
        </div>
      )}
    </div>
  );
}