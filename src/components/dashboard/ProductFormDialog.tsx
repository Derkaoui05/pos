"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, Category } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  name:       z.string().min(1, "Name is required"),
  barcode:    z.string().optional(),
  price:      z.coerce.number().positive("Price must be positive"),
  stock:      z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl:   z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open:       boolean;
  onClose:    () => void;
  categories: Category[];
  product?:   Product | null;
}

export default function ProductFormDialog({ open, onClose, categories, product }: Props) {
  const qc        = useQueryClient();
  const isEditing = !!product;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { stock: 0, price: 0 },
  });

  // Populate form when editing
  useEffect(() => {
    if (product) {
      reset({
        name:       product.name,
        barcode:    product.barcode ?? "",
        price:      product.price,
        stock:      product.stock,
        imageUrl:   product.imageUrl ?? "",
        categoryId: product.categoryId,
      });
    } else {
      reset({ name: "", barcode: "", price: 0, stock: 0, imageUrl: "", categoryId: "" });
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const url    = isEditing ? `/api/products/${product!.id}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";
      return fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }).then(r => r.json());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products-all"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(isEditing ? "Product updated" : "Product created");
      onClose();
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <Label>Name *</Label>
            <Input {...register("name")} placeholder="Product name" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label>Category *</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={v => setValue("categoryId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Price (MAD) *</Label>
              <Input type="number" step="0.01" {...register("price")} placeholder="0.00" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Stock</Label>
              <Input type="number" {...register("stock")} placeholder="0" />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Barcode */}
          <div className="space-y-1">
            <Label>Barcode</Label>
            <Input {...register("barcode")} placeholder="Optional" />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <Label>Image URL</Label>
            <Input {...register("imageUrl")} placeholder="https://..." />
            {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}