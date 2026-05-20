"use client";
import { useEffect, useState } from "react";
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
import { UploadCloud, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

const schema = z.object({
  name:       z.string().min(1, "Name is required"),
  barcode:    z.string().optional(),
  price:      z.coerce.number().positive("Price must be positive"),
  stock:      z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl:   z.string().optional().or(z.literal("")),
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
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { stock: 0, price: 0, imageUrl: "" },
  });

  const imageUrl = watch("imageUrl");

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setValue("imageUrl", data.url);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

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
      <DialogContent className="max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isEditing ? "Edit Product" : "New Product"}
          </DialogTitle>
        </DialogHeader>
 
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4 pt-1">
          {/* Name */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Name *</Label>
            <Input {...register("name")} placeholder="Product name" className="h-9 text-sm" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
 
          {/* Category */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Category *</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={v => setValue("categoryId", v)}
            >
              <SelectTrigger className="h-9 text-sm">
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
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Price (MAD) *</Label>
              <Input type="number" step="0.01" {...register("price")} placeholder="0.00" className="h-9 text-sm" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Stock</Label>
              <Input type="number" {...register("stock")} placeholder="0" className="h-9 text-sm" />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
            </div>
          </div>
 
          {/* Barcode */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Barcode</Label>
            <Input {...register("barcode")} placeholder="Optional" className="h-9 text-sm" />
          </div>
 
          {/* Image Upload Area */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Product Image</Label>
            
            <div className="flex items-center gap-4">
              {/* Image Preview Window */}
              <div className="relative h-20 w-20 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setValue("imageUrl", "")}
                      className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 text-zinc-300 dark:text-zinc-700">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* Upload Action Card */}
              <div className="flex-1">
                <div className="relative flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all duration-200 cursor-pointer">
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-900 dark:text-zinc-100" />
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mb-1" />
                      <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Click to upload file</span>
                      <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">PNG, JPG or WEBP</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>

            {/* Optional URL input toggle */}
            <div className="pt-1.5">
              <Input
                type="text"
                value={imageUrl || ""}
                onChange={(e) => setValue("imageUrl", e.target.value)}
                placeholder="Or paste an image URL here..."
                className="h-8 text-xs placeholder:text-zinc-400/80"
              />
              {errors.imageUrl && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.imageUrl.message}</p>}
            </div>
          </div>
 
          <div className="flex gap-2 pt-3">
            <Button type="button" variant="outline" className="flex-1 h-9 text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-9 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-sm" disabled={mutation.isPending || uploading}>
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}