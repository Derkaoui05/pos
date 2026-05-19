"use client";
import ProductFormDialog from "@/components/dashboard/ProductFormDialog";
import AppNavbar from "@/components/layout/AppNavbar";
import DashboardSubNav from "@/components/dashboard/DashboardSubNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Category, Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products-all"],
    queryFn: () => fetch("/api/products").then(r => r.json()),
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then(r => r.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/products/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products-all"] });
      toast.success("Product deleted");
    },
  });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search)
  );

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20">
      {/* Navigation Headers */}
      <AppNavbar />
      <DashboardSubNav />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Products
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
              {products.length} total products registered
            </p>
          </div>
          <Button onClick={() => setCreating(true)} className="h-9 px-4 text-xs font-bold tracking-wide">
            <Plus className="w-4 h-4 mr-1.5" /> Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <Input
            placeholder="Search by name or barcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Table */}
        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                <TableRow>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Name</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Category</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Barcode</TableHead>
                  <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">Price</TableHead>
                  <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">Stock</TableHead>
                  <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-500 dark:text-zinc-400 py-10 text-xs">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-500 dark:text-zinc-400 py-10 text-xs">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map(p => (
                  <TableRow key={p.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10">
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        {p.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {p.barcode ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-zinc-900 dark:text-zinc-100">
                      {p.price.toFixed(2)} MAD
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={p.stock > 10 ? "secondary" : p.stock > 0 ? "outline" : "destructive"}
                        className="text-xs font-semibold"
                      >
                        {p.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon" variant="ghost"
                          onClick={() => setEditing(p)}
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          className="h-8 w-8 text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                          onClick={() => {
                            if (confirm(`Delete "${p.name}"?`)) {
                              deleteMutation.mutate(p.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <ProductFormDialog
        open={creating}
        onClose={() => setCreating(false)}
        categories={categories}
      />
      <ProductFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        categories={categories}
        product={editing}
      />
    </div>
  );
}