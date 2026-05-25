"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductGrid from "@/components/pos/ProductGrid";
import Cart from "@/components/pos/Cart";
import AppNavbar from "@/components/layout/AppNavbar";
import { Category, Product } from "@/types";
import { LayoutGrid, ShoppingBag, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart.store";

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"catalog" | "cart">("catalog");

  const { items, total, subtotal } = useCartStore();
  const tax = total() * 0.20;
  const finalTotal = total() + tax;

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then(r => r.json()),
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then(r => r.json()),
  });

  const filtered = selectedCategory === "all"
    ? products
    : products.filter(p => p.categoryId === selectedCategory);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20">
      {/* Global Navbar */}
      <AppNavbar />

      {/* Mobile Tab Switcher (Visible only on mobile/tablet) */}
      <div className="flex md:hidden border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all duration-200 flex items-center justify-center gap-2
            ${activeTab === "catalog"
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
              : "border-transparent text-zinc-400 dark:text-zinc-500"
            }`}
        >
          <ShoppingBag className="h-4 w-4" />
          Products Catalog
        </button>
        <button
          onClick={() => setActiveTab("cart")}
          className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all duration-200 flex items-center justify-center gap-2 relative
            ${activeTab === "cart"
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50"
              : "border-transparent text-zinc-400 dark:text-zinc-500"
            }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Order Cart
          {items.length > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Main POS Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Side: Products Catalog & Categories */}
        <div className={`flex flex-col flex-1 overflow-hidden p-4 md:p-6 gap-3 md:gap-5 ${activeTab === "catalog" ? "flex" : "hidden md:flex"}`}>
          
          {/* Category Tabs Container */}
          <div className="flex items-center gap-2 md:gap-3 border-b border-zinc-200/65 dark:border-zinc-800/65 pb-3">
            <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mr-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin flex-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap transition-all duration-200 border
                  ${selectedCategory === "all"
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
              >
                All Products
              </button>
              
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap transition-all duration-200 border
                    ${selectedCategory === c.id
                      ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 shadow-sm"
                      : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 overflow-y-auto pr-1">
            <ProductGrid products={filtered} isLoading={isLoadingProducts} />
          </div>
        </div>

        {/* Floating View Cart Action Badge (Mobile Only - catalog view) */}
        {activeTab === "catalog" && items.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 md:hidden z-45">
            <button
              onClick={() => setActiveTab("cart")}
              className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 flex items-center justify-between px-5 font-bold shadow-lg transition-transform active:scale-98 animate-fade-in-up"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <span className="text-xs tracking-wider uppercase">
                View Cart ({finalTotal.toFixed(2)} MAD)
              </span>
            </button>
          </div>
        )}

        {/* Right Side: Order Cart */}
        <div className={`w-full md:w-[380px] border-l border-zinc-200/80 dark:border-zinc-800/80 flex flex-col bg-white dark:bg-zinc-950 shadow-sm ${activeTab === "cart" ? "flex" : "hidden md:flex"}`}>
          <Cart />
        </div>

      </div>
    </div>
  );
}