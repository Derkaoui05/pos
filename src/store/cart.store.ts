import { create } from "zustand";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  name:      string;
  price:     number;
  quantity:  number;
  stock:     number;
}

interface CartStore {
  items:       CartItem[];
  discount:    number;
  addItem:     (product: Omit<CartItem, "quantity">) => void;
  removeItem:  (productId: string) => void;
  updateQty:   (productId: string, quantity: number) => void;
  setDiscount: (discount: number) => void;
  clearCart:   () => void;
  subtotal:    () => number;
  total:       () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items:    [],
  discount: 0,

  addItem: (product) => set((s) => {
    const existing = s.items.find(i => i.productId === product.productId);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error(`We only have ${product.stock} left in stock for "${product.name}"!`);
        return { items: s.items };
      }
      return { items: s.items.map(i => i.productId === product.productId
        ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...s.items, { ...product, quantity: 1 }] };
  }),

  removeItem: (productId) => set(s => ({
    items: s.items.filter(i => i.productId !== productId),
  })),

  updateQty: (productId, quantity) => set(s => {
    const existing = s.items.find(i => i.productId === productId);
    if (!existing) return { items: s.items };

    if (quantity > existing.stock) {
      toast.error(`We only have ${existing.stock} left in stock for "${existing.name}"!`);
      return { items: s.items.map(i => i.productId === productId ? { ...i, quantity: existing.stock } : i) };
    }

    return {
      items: quantity <= 0
        ? s.items.filter(i => i.productId !== productId)
        : s.items.map(i => i.productId === productId ? { ...i, quantity } : i),
    };
  }),

  setDiscount: (discount) => set({ discount }),
  clearCart:   () => set({ items: [], discount: 0 }),
  subtotal:    () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  total:       () => get().subtotal() - get().discount,
}));