"use client";
import { useCartStore } from "@/store/cart.store";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function ProductGrid({ products }: { products: Product[] }) {
  const addItem = useCartStore(s => s.addItem);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto">
      {products.map(p => (
        <button
          key={p.id}
          onClick={() => addItem({ productId: p.id, name: p.name, price: p.price })}
          disabled={p.stock === 0}
          className="relative flex flex-col items-start gap-1 p-3 rounded-xl border bg-card
            hover:bg-accent hover:border-primary transition-all text-left
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {/* Image placeholder */}
          <div className="w-full aspect-square rounded-lg bg-muted flex items-center justify-center mb-1">
            {p.imageUrl
              ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-lg" />
              : <span className="text-3xl">🛍️</span>
            }
          </div>

          <span className="text-sm font-medium leading-tight line-clamp-2">{p.name}</span>
          <span className="text-sm font-bold text-primary">{p.price.toFixed(2)} MAD</span>

          <Badge
            variant={p.stock > 10 ? "secondary" : p.stock > 0 ? "outline" : "destructive"}
            className="text-xs absolute top-2 right-2"
          >
            {p.stock > 0 ? `${p.stock} left` : "Out"}
          </Badge>
        </button>
      ))}

      {products.length === 0 && (
        <div className="col-span-full flex items-center justify-center h-40 text-muted-foreground text-sm">
          No products found
        </div>
      )}
    </div>
  );
}