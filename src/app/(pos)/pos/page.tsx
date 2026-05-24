"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductGrid from "@/components/pos/ProductGrid";
import Cart from "@/components/pos/Cart";
import AppNavbar from "@/components/layout/AppNavbar";
import { Category, Product } from "@/types";
import { LayoutGrid } from "lucide-react";

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

      {/* Main POS Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Products Catalog & Categories */}
        <div className="flex flex-col flex-1 overflow-hidden p-6 gap-5">
          
          {/* Category Tabs Container */}
          <div className="flex items-center gap-3 border-b border-zinc-200/65 dark:border-zinc-800/65 pb-3">
            <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mr-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin flex-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border
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
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border
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

        {/* Right Side: Order Cart */}
        <div className="w-[380px] border-l border-zinc-200/80 dark:border-zinc-800/80 flex flex-col bg-white dark:bg-zinc-950 shadow-sm">
          <Cart />
        </div>

      </div>
    </div>
  );
}