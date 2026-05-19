"use client";
import CategoryFormDialog from "@/components/dashboard/CategoryFormDialog";
import AppNavbar from "@/components/layout/AppNavbar";
import DashboardSubNav from "@/components/dashboard/DashboardSubNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Category } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then(r => r.json()),
  });

  // Fetch products to show count per category
  const { data: products = [] } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => fetch("/api/products").then(r => r.json()),
  });

  const productCount = (categoryId: string) =>
    products.filter((p: any) => p.categoryId === categoryId).length;

  const deleteMutation = useMutation({
    pointer: "categories-delete",
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20">
      {/* Navigation Headers */}
      <AppNavbar />
      <DashboardSubNav />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Categories
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
              {categories.length} total categories registered
            </p>
          </div>
          <Button onClick={() => setCreating(true)} className="h-9 px-4 text-xs font-bold tracking-wide">
            <Plus className="w-4 h-4 mr-1.5" /> Add Category
          </Button>
        </div>

        {/* Table */}
        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                <TableRow>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Name</TableHead>
                  <TableHead className="text-center font-semibold text-zinc-700 dark:text-zinc-300">Products</TableHead>
                  <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-zinc-500 dark:text-zinc-400 py-10 text-xs">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-zinc-500 dark:text-zinc-400 py-10 text-xs">
                      No categories yet
                    </TableCell>
                  </TableRow>
                )}
                {categories.map(c => (
                  <TableRow key={c.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10">
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{c.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        {productCount(c.id)} products
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon" variant="ghost"
                          onClick={() => setEditing(c)}
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          className="h-8 w-8 text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                          onClick={() => {
                            if (confirm(`Delete "${c.name}"?`)) {
                              deleteMutation.mutate(c.id);
                            }
                          }}
                          disabled={productCount(c.id) > 0}
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
      <CategoryFormDialog
        open={creating}
        onClose={() => setCreating(false)}
      />
      <CategoryFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        category={editing}
      />
    </div>
  );
}