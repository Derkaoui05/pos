"use client";
import CategoryFormDialog from "@/components/dashboard/CategoryFormDialog";
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
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm">{categories.length} total categories</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Dashboard
          </a>
          <Button onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Category
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    No categories yet
                  </TableCell>
                </TableRow>
              )}
              {categories.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{productCount(c.id)} products</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon" variant="ghost"
                        onClick={() => setEditing(c)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon" variant="ghost"
                        className="text-destructive hover:text-destructive"
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