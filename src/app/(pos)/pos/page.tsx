"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductGrid from "@/components/pos/ProductGrid";
import Cart from "@/components/pos/Cart";
import { Category, Product } from "@/types";

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: products = [] } = useQuery<Product[]>({
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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left — Products */}
      <div className="flex flex-col flex-1 overflow-hidden p-4 gap-4">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${selectedCategory === c.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <ProductGrid products={filtered} />
      </div>

      {/* Right — Cart */}
      <div className="w-[360px] border-l flex flex-col bg-card">
        <Cart />
      </div>
    </div>
  );
}